import {
  GoalTypeEnum,
  GoalDirectionEnum,
  GoalPeriodEnum,
  GoalStatusEnum,
} from '@/enums/GoalEnums';

export const createGoal = ({
  counterId = '',
  type = GoalTypeEnum.VALUE_TARGET,
  direction = GoalDirectionEnum.INCREASE,
  targetValue = 0,
  period = GoalPeriodEnum.WEEKLY,
} = {}) => ({
  id: Date.now().toString(),
  counterId,
  type,
  direction,
  targetValue,
  period,
  status: GoalStatusEnum.ACTIVE,
  createdAt: new Date().toISOString(),
});
