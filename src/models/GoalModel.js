import { GoalTypeEnum, GoalStatusEnum } from '@/enums/GoalEnums';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultParams = {
  counterId:        '',
  targetValue:      0,
  timeLimitMinutes: null, // total minutes (e.g. 90 = 1h 30m)
};

/* ---------------------------------
   CREATE GOAL
--------------------------------- */

export const createGoal = ({
  counterId        = defaultParams.counterId,
  targetValue      = defaultParams.targetValue,
  timeLimitMinutes = defaultParams.timeLimitMinutes,
} = {}) => ({
  id:               Date.now().toString(),
  counterId,
  type:             GoalTypeEnum.VALUE_TARGET,
  targetValue,
  timeLimitMinutes,
  notificationIds:  [],
  status:           GoalStatusEnum.ACTIVE,
  createdAt:        new Date().toISOString(),
});