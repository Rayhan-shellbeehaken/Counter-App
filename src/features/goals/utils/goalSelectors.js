import { GoalStatusEnum } from '@/enums/GoalEnums';

export const getActiveGoalForCounter = ({
  goals = [],
  counterId = '',
} = {}) =>
  goals.find(
    (g) =>
      g.counterId === counterId &&
      g.status === GoalStatusEnum.ACTIVE
  ) ?? null;
