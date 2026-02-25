import { showImmediateNotification } from '@/services/notificationService';

/* ---------------------------------
   GOAL COMPLETED NOTIFICATION
   Replaces the old Alert-based version.
   Called from useGoalEvaluator when a goal is marked completed.
--------------------------------- */

export const showGoalCompletedNotification = async ({
  goal    = {},
  counter = {},
} = {}) => {
  const counterName = counter?.name    ?? 'Counter';
  const target      = goal?.targetValue ?? 0;

  await showImmediateNotification({
    title: '🎉 Goal Completed!',
    body:  `${counterName} reached its target of ${target}. Great work!`,
    data: {
      goalId:    goal?.id,
      counterId: counter?.id,
    },
  });
};