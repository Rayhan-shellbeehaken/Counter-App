import { useGoalStore } from '@/store/goalStore';
import { evaluateGoal } from '@/services/goalService';
import { GoalStatusEnum } from '@/enums/GoalEnums';
import { showGoalCompletedNotification } from '@/services/goalNotificationService';
import { showImmediateNotification } from '@/services/notificationService';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultParams = {
  counter: null,
  analytics: null,
};

/* ---------------------------------
   EVALUATE GOALS FOR COUNTER
--------------------------------- */

export const evaluateGoalsForCounter = async ({
  counter = defaultParams.counter,
  analytics = defaultParams.analytics,
} = {}) => {
  if (!counter || !counter.id) {
    return;
  }

  const state = useGoalStore.getState();
  const goals = state?.goals ?? [];
  const markCompleted = state?.markCompleted ?? (() => {});

  const activeGoals = goals.filter((goal) =>
    isActiveGoalForCounter(goal, counter)
  );

  for (const goal of activeGoals) {
    await handleGoalEvaluation({
      goal,
      counter,
      analytics,
      markCompleted,
    });
  }
};

/* ---------------------------------
   HELPERS
--------------------------------- */

const isActiveGoalForCounter = (goal = {}, counter = {}) =>
  goal?.counterId === counter?.id && goal?.status === GoalStatusEnum.ACTIVE;

const handleGoalEvaluation = async ({
  goal = null,
  counter = null,
  analytics = null,
  markCompleted = () => {},
} = {}) => {
  const resultStatus = evaluateGoal({
    goal,
    counter,
    analytics,
  });

  if (resultStatus !== GoalStatusEnum.COMPLETED) {
    return;
  }

  // Mark as completed (this will also cancel notifications via goalStore)
  await markCompleted(goal.id);

  // Show completion notification
  await showCompletionNotification({ goal, counter });

  // Legacy support for existing goalNotificationService
  if (typeof showGoalCompletedNotification === 'function') {
    showGoalCompletedNotification({ goal, counter });
  }
};

const showCompletionNotification = async ({
  goal = {},
  counter = {},
} = {}) => {
  const title = '🎉 Goal Completed!';
  const body = buildCompletionMessage(goal, counter);

  await showImmediateNotification({
    title,
    body,
    data: {
      goalId: goal.id,
      counterId: counter.id,
    },
  });
};

const buildCompletionMessage = (goal = {}, counter = {}) => {
  const counterName = counter?.name ?? 'Counter';
  const targetValue = goal?.targetValue ?? 0;

  return `${counterName} reached ${targetValue}! Great job!`;
};