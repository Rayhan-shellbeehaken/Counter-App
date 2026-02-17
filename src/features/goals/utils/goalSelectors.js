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
  
export const mapCountersWithGoals = ({
  counters = [],
  goals = [],
}) =>
  counters.map((counter) => ({
    counter,
    goal: getActiveGoalForCounter({
      goals,
      counterId: counter.id,
    }),
  }));
