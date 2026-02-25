import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

import { NotificationTypeEnum } from '@/enums/NotificationEnums';

/* ---------------------------------
   ENV CHECK
--------------------------------- */

const isExpoGo = Constants.appOwnership === 'expo';

/* ---------------------------------
   NOTIFICATION HANDLER
   Must be set at module level (before any scheduling)
--------------------------------- */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList:   true,
    shouldPlaySound:  true,
    shouldSetBadge:   false,
  }),
});

/* ---------------------------------
   ANDROID CHANNEL
--------------------------------- */

const createAndroidChannel = async () => {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync('goal-reminders', {
      name:             'Goal Reminders',
      importance:       Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:       '#4cc9f0',
    });
  } catch (error) {
    console.warn('Channel creation failed:', error);
  }
};

/* ---------------------------------
   PERMISSION
--------------------------------- */

export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const isGranted = finalStatus === 'granted';

    if (!isGranted) {
      console.warn('⚠️ Notification permission denied');
    }

    return isGranted;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/* ---------------------------------
   SCHEDULE GOAL REMINDERS
   Schedules 2 notifications:
     1. Half-time warning  (timeLimitHours / 2)
     2. Deadline reminder  (timeLimitHours)
   Returns array of notificationIds to store on the goal.
--------------------------------- */

export const scheduleGoalReminders = async (goal = {}) => {
  if (isExpoGo) {
    console.warn('Notifications disabled in Expo Go. Use a development build.');
    return [];
  }

  if (!isValidGoalForScheduling(goal)) {
    console.log('Skipping reminders: goal missing timeLimitHours or targetValue');
    return [];
  }

  await createAndroidChannel();

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return [];

  // Cancel any existing notifications for this goal first
  if (goal?.notificationIds?.length) {
    await cancelGoalNotifications(goal);
  }

  const ids = await scheduleHalfTimeAndDeadline(goal);

  console.log(`📅 Scheduled ${ids.length} notification(s) for goal ${goal.id}`);
  return ids;
};

const isValidGoalForScheduling = (goal = {}) =>
  goal?.timeLimitHours > 0 && goal?.targetValue > 0;

/* ---------------------------------
   HALF-TIME + DEADLINE SCHEDULER
--------------------------------- */

const scheduleHalfTimeAndDeadline = async (goal = {}) => {
  const totalHours  = goal.timeLimitHours;
  const halfHours   = totalHours / 2;

  const results = await Promise.allSettled([
    scheduleOneNotification({
      goal,
      hoursFromNow: halfHours,
      type:         NotificationTypeEnum.GOAL_HALF_TIME,
      title:        '⏳ Halfway There!',
      body:         buildHalfTimeBody(goal),
    }),
    scheduleOneNotification({
      goal,
      hoursFromNow: totalHours,
      type:         NotificationTypeEnum.GOAL_DEADLINE,
      title:        '⌛ Time\'s Up!',
      body:         buildDeadlineBody(goal),
    }),
  ]);

  return results
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value);
};

/* ---------------------------------
   CORE SCHEDULER
--------------------------------- */

const scheduleOneNotification = async ({
  goal        = {},
  hoursFromNow = 1,
  type        = NotificationTypeEnum.GOAL_REMINDER,
  title       = '🎯 Goal Reminder',
  body        = '',
} = {}) => {
  try {
    const seconds = hoursFromNow * 60 * 60;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        data: {
          type,
          goalId:    goal.id,
          counterId: goal.counterId,
        },
        ...(Platform.OS === 'android' && {
          channelId: 'goal-reminders',
          priority:  'high',
        }),
      },
      trigger: {
        type:    Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
      },
    });

    console.log(`✅ [${type}] scheduled in ${hoursFromNow}h → id: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error(`❌ Failed to schedule [${type}]:`, error);
    return null;
  }
};

/* ---------------------------------
   IMMEDIATE NOTIFICATION
   Used for goal completion (fires instantly)
--------------------------------- */

export const showImmediateNotification = async ({
  title = '🎉 Goal Completed!',
  body  = '',
  data  = {},
} = {}) => {
  if (isExpoGo) {
    console.warn('Immediate notifications do not work in Expo Go (SDK 53).');
    return null;
  }

  try {
    await createAndroidChannel();

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return null;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        data:  { type: NotificationTypeEnum.GOAL_COMPLETED, ...data },
        ...(Platform.OS === 'android' && {
          channelId: 'goal-reminders',
          priority:  'high',
        }),
      },
      trigger: null, // null = fire immediately
    });

    console.log('🎉 Completion notification fired:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error showing immediate notification:', error);
    return null;
  }
};

/* ---------------------------------
   CANCEL NOTIFICATIONS
--------------------------------- */

export const cancelGoalNotifications = async (goal = {}) => {
  const ids = goal?.notificationIds ?? [];
  if (!ids.length) return;

  await Promise.allSettled(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id))
  );

  console.log(`🗑️ Cancelled ${ids.length} notification(s) for goal ${goal.id}`);
};

/* ---------------------------------
   NOTIFICATION BODY BUILDERS
--------------------------------- */

const buildHalfTimeBody = (goal = {}) => {
  const hours  = goal?.timeLimitHours ?? 0;
  const target = goal?.targetValue    ?? 0;
  return `Half your time is up (${hours / 2}h passed). Still aiming for ${target}?`;
};

const buildDeadlineBody = (goal = {}) => {
  const target = goal?.targetValue ?? 0;
  return `Time's up! Did you reach your target of ${target}?`;
};