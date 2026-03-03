import { useGoalStore } from '@/store/goalStore';
import { evaluateGoal } from '@/services/goalService';
import { GoalStatusEnum } from '@/enums/GoalEnums';
import { showGoalCompletedNotification } from '@/services/goalNotificationService';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultParams = {
  counter:   null,
  analytics: null,
};

/* ---------------------------------
   EVALUATE GOALS FOR COUNTER
   Called on every increment from counterStore.
--------------------------------- */

export const evaluateGoalsForCounter = async ({
  counter   = defaultParams.counter,
  analytics = defaultParams.analytics,
} = {}) => {
  if (!counter?.id) return;

  const state        = useGoalStore.getState();
  const goals        = state?.goals        ?? [];
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
  goal?.counterId === counter?.id &&
  goal?.status    === GoalStatusEnum.ACTIVE;

const handleGoalEvaluation = async ({
  goal          = null,
  counter       = null,
  analytics     = null,
  markCompleted = () => {},
} = {}) => {
  const resultStatus = evaluateGoal({ goal, counter, analytics });

  if (resultStatus !== GoalStatusEnum.COMPLETED) return;

  // 1. Mark completed in store (also cancels scheduled notifications)
  await markCompleted(goal.id);

  // 2. Fire immediate push notification
  await showGoalCompletedNotification({ goal, counter });
};