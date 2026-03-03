import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

import { NotificationTypeEnum } from '@/enums/NotificationEnums';

/* ---------------------------------
   ENV CHECK (EXPO GO LIMITATION)
--------------------------------- */

const isExpoGo = Constants.appOwnership === 'expo';

/* ---------------------------------
   NOTIFICATION HANDLER (SDK 53 SAFE)
--------------------------------- */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* ---------------------------------
   ANDROID CHANNEL (REQUIRED)
--------------------------------- */

const createAndroidChannel = async () => {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync('goal-reminders', {
      name: 'Goal Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4cc9f0',
    });
  } catch (error) {
    console.warn('Channel creation failed:', error);
  }
};

/* ---------------------------------
   PERMISSION MANAGEMENT
--------------------------------- */

export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } =
        await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const isGranted = finalStatus === 'granted';

    if (!isGranted) {
      console.warn('Notification permission denied');
    }

    return isGranted;
  } catch (error) {
    console.error(
      'Error requesting notification permission:',
      error
    );
    return false;
  }
};

/* ---------------------------------
   SCHEDULE GOAL REMINDERS (MINUTES MODE)
--------------------------------- */

export const scheduleGoalReminders = async (goal = {}) => {
  // 🚫 Expo Go cannot trigger notifications (SDK 53 limitation)
  if (isExpoGo) {
    console.warn(
      'Notifications disabled in Expo Go. Use development build.'
    );
    return [];
  }

  if (!shouldScheduleReminders(goal)) {
    console.log('Skipping reminders: invalid goal config');
    return [];
  }

  await createAndroidChannel();

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return [];
  }

  // Cancel old notifications (prevents duplicates)
  if (goal?.notificationIds?.length) {
    await cancelGoalNotifications(goal);
  }

  const notificationIds = await scheduleSingleNotification(goal);
  return notificationIds;
};

const shouldScheduleReminders = (goal = {}) => {
  const hasTime =
    goal?.timeLimitHours && goal.timeLimitHours > 0;
  const hasTarget =
    goal?.targetValue && goal.targetValue > 0;

  return hasTime && hasTarget;
};

/* ---------------------------------
   SINGLE NOTIFICATION (NO SPAM)
   Treat timeLimitHours as MINUTES (for testing)
--------------------------------- */

const scheduleSingleNotification = async (goal = {}) => {
  const minutes = goal?.timeLimitHours ?? 0;

  if (!minutes || minutes <= 0) {
    return [];
  }

  try {
    const notificationId = await scheduleNotification({
      goal,
      minutesFromNow: minutes,
    });

    return notificationId ? [notificationId] : [];
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return [];
  }
};

/* ---------------------------------
   CORE SCHEDULER (FIXED - MISSING BEFORE)
--------------------------------- */

const scheduleNotification = async ({
  goal = {},
  minutesFromNow = 1,
} = {}) => {
  try {
    const trigger = buildTrigger(minutesFromNow);
    const content = buildNotificationContent(goal);

    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });

    console.log(
      `Notification scheduled in ${minutesFromNow} minute(s):`,
      notificationId
    );

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

/* ---------------------------------
   NOTIFICATION CONTENT
--------------------------------- */

const buildNotificationContent = (goal = {}) => ({
  title: '🎯 Goal Reminder',
  body: buildNotificationBody(goal),
  sound: 'default',
  badge: 1,
  data: {
    type: NotificationTypeEnum.GOAL_REMINDER,
    goalId: goal.id,
    counterId: goal.counterId,
  },
  ...(Platform.OS === 'android' && {
    channelId: 'goal-reminders',
    priority: 'high',
  }),
});

const buildNotificationBody = (goal = {}) => {
  const targetValue = goal?.targetValue ?? 0;
  const minutes = goal?.timeLimitHours ?? 0; // minutes mode for testing

  return `Target ${targetValue} — Reminder in ${minutes} min`;
};

/* ---------------------------------
   SDK 53 TRIGGER (MINUTES)
--------------------------------- */

const buildTrigger = (minutesFromNow = 1) => {
  const seconds = minutesFromNow * 60;

  return {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds,
    repeats: false,
  };
};

/* ---------------------------------
   CANCEL NOTIFICATIONS
--------------------------------- */

export const cancelGoalNotifications = async (goal = {}) => {
  const notificationIds = goal?.notificationIds ?? [];

  if (!notificationIds.length) return;

  await Promise.allSettled(
    notificationIds.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id)
    )
  );
};

/* ---------------------------------
   DEBUG HELPERS
--------------------------------- */

export const showImmediateNotification = async ({
  title = 'Test Notification',
  body = 'If you see this, notifications work.',
  data = {},
} = {}) => {
  if (isExpoGo) {
    console.warn(
      'Immediate notifications do not work in Expo Go (SDK 53).'
    );
    return null;
  }

  try {
    const hasPermission =
      await requestNotificationPermission();
    if (!hasPermission) return null;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        data,
      },
      trigger: null,
    });
  } catch (error) {
    console.error(
      'Error showing immediate notification:',
      error
    );
    return null;
  }
};