import { useGoalStore } from '@/store/goalStore';
import { evaluateGoal } from '@/services/goalService';
import { GoalStatusEnum } from '@/enums/GoalEnums';
import { showGoalCompletedNotification } from '@/services/goalNotificationService';

export const evaluateGoalsForCounter = ({
  counter = null,
  analytics = null,
} = {}) => {
  if (!counter || !counter.id) return;

  const { goals = [], markCompleted } = useGoalStore.getState();

  goals
    .filter(
      (goal) =>
        goal?.counterId === counter.id &&
        goal?.status === GoalStatusEnum.ACTIVE
    )
    .forEach((goal) => {
      const resultStatus = evaluateGoal({
        goal,
        counter,
        analytics,
      });

      if (resultStatus === GoalStatusEnum.COMPLETED) {
        markCompleted(goal.id);

        showGoalCompletedNotification({
          goal,
          counter,
        });
      }
    });
};
