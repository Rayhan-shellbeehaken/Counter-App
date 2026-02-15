import { Alert } from 'react-native';

/**
 * Show goal completion notification
 * (Toast / Alert / Expo Notification later)
 */
export const showGoalCompletedNotification = ({
  goal = {},
  counter = {},
} = {}) => {
  const counterName = counter?.name ?? 'Counter';
  const target = goal?.targetValue ?? 0;

  Alert.alert(
    '🎉 Goal Completed',
    `${counterName} reached its target (${target})`
  );
};
