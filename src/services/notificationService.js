import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

import * as Device from 'expo-device';
import { NotificationTypeEnum } from '@/enums/NotificationEnums';

/* ---------------------------------
   ENV CHECK
--------------------------------- */

const isExpoGo = Constants.appOwnership === 'expo';

/* ---------------------------------
   NOTIFICATION HANDLER
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
    // Android 12+ needs exact alarm permission
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      await Notifications.requestPermissionsAsync({
        android: {
          allowAlerts: true,
          allowBadges: true,
          allowSounds: true,
        },
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const isGranted = finalStatus === 'granted';
    if (!isGranted) console.warn('Notification permission denied');
    return isGranted;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/* ---------------------------------
   SCHEDULE GOAL REMINDERS
   Schedules 2 notifications:
     1. Half-time warning  → timeLimitMinutes / 2
     2. Deadline reminder  → timeLimitMinutes
--------------------------------- */

export const scheduleGoalReminders = async (goal = {}) => {
  if (isExpoGo) {
    console.warn('Notifications disabled in Expo Go. Use a development build.');
    return [];
  }

  if (!isValidGoalForScheduling(goal)) {
    console.log('Skipping reminders: goal missing timeLimitMinutes or targetValue');
    return [];
  }

  await createAndroidChannel();

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return [];

  if (goal?.notificationIds?.length) {
    await cancelGoalNotifications(goal);
  }

  const ids = await scheduleHalfTimeAndDeadline(goal);
  console.log(`Scheduled ${ids.length} notification(s) for goal ${goal.id}`);
  return ids;
};

const isValidGoalForScheduling = (goal = {}) =>
  goal?.timeLimitMinutes > 0 && goal?.targetValue > 0;

/* ---------------------------------
   HALF-TIME + DEADLINE SCHEDULER
--------------------------------- */

const scheduleHalfTimeAndDeadline = async (goal = {}) => {
  const totalMinutes = goal.timeLimitMinutes;
  const halfMinutes  = totalMinutes / 2;

  const results = await Promise.allSettled([
    scheduleOneNotification({
      goal,
      minutesFromNow: halfMinutes,
      type:           NotificationTypeEnum.GOAL_HALF_TIME,
      title:          '⏳ Halfway There!',
      body:           buildHalfTimeBody(goal),
    }),
    scheduleOneNotification({
      goal,
      minutesFromNow: totalMinutes,
      type:           NotificationTypeEnum.GOAL_DEADLINE,
      title:          "⌛ Time's Up!",
      body:           buildDeadlineBody(goal),
    }),
  ]);

  return results
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value);
};

/* ---------------------------------
   CORE SCHEDULER
   Uses DATE trigger instead of TIME_INTERVAL
   so Android fires it exactly even when backgrounded
--------------------------------- */

const scheduleOneNotification = async ({
  goal           = {},
  minutesFromNow = 1,
  type           = NotificationTypeEnum.GOAL_REMINDER,
  title          = '🎯 Goal Reminder',
  body           = '',
} = {}) => {
  try {
    const seconds = Math.round(minutesFromNow * 60);

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
      // 🔑 DATE trigger — Android must fire at exact time even when backgrounded
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(Date.now() + seconds * 1000),
      },
    });

    console.log(`[${type}] scheduled in ${minutesFromNow}min → id: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error(`Failed to schedule [${type}]:`, error);
    return null;
  }
};

/* ---------------------------------
   IMMEDIATE NOTIFICATION
   Used for goal completion
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
      trigger: null,
    });

    console.log('Completion notification fired:', notificationId);
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

  console.log(`Cancelled ${ids.length} notification(s) for goal ${goal.id}`);
};

/* ---------------------------------
   BODY BUILDERS
--------------------------------- */

const buildHalfTimeBody = (goal = {}) => {
  const total  = goal?.timeLimitMinutes ?? 0;
  const half   = total / 2;
  const target = goal?.targetValue ?? 0;
  const label  = half >= 60
    ? `${Math.round((half / 60) * 10) / 10}h`
    : `${half}m`;
  return `${label} passed. Still aiming for ${target}?`;
};

const buildDeadlineBody = (goal = {}) => {
  const target = goal?.targetValue ?? 0;
  return `Time's up! Did you reach your target of ${target}?`;
};