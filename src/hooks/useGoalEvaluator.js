import { useGoalStore } from '@/store/goalStore';
import { evaluateGoal } from '@/services/goalService';
import { GoalStatusEnum } from '@/enums/GoalEnums';
import { showGoalCompletedNotification } from '@/services/goalNotificationService';

const defaultParams = {
  counter: null,
  analytics: null,
};

export const evaluateGoalsForCounter = ({
  counter = defaultParams.counter,
  analytics = defaultParams.analytics,
} = {}) => {
  if (!counter || !counter.id) {
    return;
  }

  const state = useGoalStore.getState();
  const goals = state?.goals ?? [];
  const markCompleted = state?.markCompleted ?? (() => {});

  goals
    .filter((goal) => isActiveGoalForCounter(goal, counter))
    .forEach((goal) => {
      handleGoalEvaluation({
        goal,
        counter,
        analytics,
        markCompleted,
      });
    });
};

/* ---------------------------------
   PURE HELPERS (NO SIDE EFFECTS)
--------------------------------- */

const isActiveGoalForCounter = (goal = {}, counter = {}) =>
  goal?.counterId === counter?.id &&
  goal?.status === GoalStatusEnum.ACTIVE;

const handleGoalEvaluation = ({
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

  markCompleted(goal.id);

  showGoalCompletedNotification({
    goal,
    counter,
  });
};
