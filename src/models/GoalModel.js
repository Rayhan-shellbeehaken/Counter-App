import { GoalTypeEnum, GoalStatusEnum } from '@/enums/GoalEnums';

const defaultParams = {
  counterId: '',
  targetValue: 0,
};

export const createGoal = ({
  counterId = defaultParams.counterId,
  targetValue = defaultParams.targetValue,
} = {}) => ({
  id: Date.now().toString(),
  counterId,
  type: GoalTypeEnum.VALUE_TARGET,
  targetValue,
  status: GoalStatusEnum.ACTIVE,
  createdAt: new Date().toISOString(),
});
