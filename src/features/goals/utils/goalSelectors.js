import { GoalStatusEnum } from '@/enums/GoalEnums';

// Returns ACTIVE goal for a counter
export const getActiveGoalForCounter = ({
  goals = [],
  counterId = '',
} = {}) =>
  goals.find(
    (g) =>
      g.counterId === counterId &&
      g.status === GoalStatusEnum.ACTIVE
  ) ?? null;

// ✅ NEW: Returns COMPLETED goal for a counter
export const getCompletedGoalForCounter = ({
  goals = [],
  counterId = '',
} = {}) =>
  goals.find(
    (g) =>
      g.counterId === counterId &&
      g.status === GoalStatusEnum.COMPLETED
  ) ?? null;

// ✅ NEW: Returns either ACTIVE or COMPLETED goal (whichever exists)
export const getGoalForCounter = ({
  goals = [],
  counterId = '',
} = {}) =>
  goals.find(
    (g) =>
      g.counterId === counterId &&
      (g.status === GoalStatusEnum.ACTIVE ||
        g.status === GoalStatusEnum.COMPLETED)
  ) ?? null;

export const mapCountersWithGoals = ({
  counters = [],
  goals = [],
}) =>
  counters.map((counter) => ({
    counter,
    goal: getGoalForCounter({   // ✅ was: getActiveGoalForCounter
      goals,
      counterId: counter.id,
    }),
  }));