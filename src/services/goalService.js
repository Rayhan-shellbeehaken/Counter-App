import {
  GoalTypeEnum,
  GoalStatusEnum,
} from '@/enums/GoalEnums';

/* ---------------------------------
   PUBLIC API
--------------------------------- */
export const evaluateGoal = ({
  goal = null,
  counter = null,
  analytics = null,
} = {}) => {
  if (!goal?.type) return GoalStatusEnum.ACTIVE;

  switch (goal.type) {
    case GoalTypeEnum.VALUE_TARGET:
      return evaluateValueTarget(goal, counter);

    case GoalTypeEnum.TOTAL_ACTIONS:
      return evaluateTotalActions(goal, analytics);

    default:
      return GoalStatusEnum.ACTIVE;
  }
};

/* ---------------------------------
   HELPERS
--------------------------------- */

const evaluateValueTarget = (
  goal = {},
  counter = {}
) => {
  const currentValue = counter?.value ?? 0;
  const target = goal?.targetValue ?? 0;

  return currentValue >= target
    ? GoalStatusEnum.COMPLETED
    : GoalStatusEnum.ACTIVE;
};

const evaluateTotalActions = (
  goal = {},
  analytics = {}
) => {
  const total = analytics?.total ?? 0;
  const target = goal?.targetValue ?? 0;

  return total >= target
    ? GoalStatusEnum.COMPLETED
    : GoalStatusEnum.ACTIVE;
};
