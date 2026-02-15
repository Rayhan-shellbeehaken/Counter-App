import {
  GoalTypeEnum,
  GoalPeriodEnum,
} from '@/enums/GoalEnums';

export const buildGoalDescription = ({
  goal = {},
  counter = {},
} = {}) => {
  if (!goal?.type || !counter?.name) {
    return 'Invalid goal';
  }

  switch (goal.type) {
    case GoalTypeEnum.VALUE_TARGET:
      return buildValueTargetDescription(goal, counter);

    default:
      return 'Unknown goal';
  }
};

/* ---------------------------------
   HELPERS
--------------------------------- */

const buildValueTargetDescription = (
  goal = {},
  counter = {}
) => {
  const target = goal.targetValue ?? 0;
  const periodLabel = getPeriodLabel(goal.period);

  return `${counter.name} → Target ${target} (${periodLabel})`;
};

const getPeriodLabel = (period = '') => {
  switch (period) {
    case GoalPeriodEnum.DAILY:
      return 'Daily';
    case GoalPeriodEnum.WEEKLY:
      return 'Weekly';
    case GoalPeriodEnum.MONTHLY:
      return 'Monthly';
    default:
      return 'Unknown period';
  }
};
