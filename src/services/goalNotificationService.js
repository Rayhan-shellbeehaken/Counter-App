import { Alert } from 'react-native';

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
