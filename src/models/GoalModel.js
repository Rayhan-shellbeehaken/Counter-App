import { GoalTypeEnum, GoalStatusEnum } from '@/enums/GoalEnums';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultParams = {
  counterId: '',
  targetValue: 0,
  timeLimitHours: null,
};

/* ---------------------------------
   CREATE GOAL
--------------------------------- */

export const createGoal = ({
  counterId = defaultParams.counterId,
  targetValue = defaultParams.targetValue,
  timeLimitHours = defaultParams.timeLimitHours,
} = {}) => ({
  id: Date.now().toString(),
  counterId,
  type: GoalTypeEnum.VALUE_TARGET,
  targetValue,
  timeLimitHours,
  notificationIds: [],
  status: GoalStatusEnum.ACTIVE,
  createdAt: new Date().toISOString(),
});