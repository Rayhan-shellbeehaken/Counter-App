import { HistoryActionTypeEnum } from '@/enums/CounterEnums';

 
export const createHistoryAction = ({
  type = HistoryActionTypeEnum.INCREMENT,
  counterId = null,
  prevValue = 0,
  nextValue = 0,
  step = 1,
  timestamp = new Date().toISOString(),
}) => ({
  type,
  counterId,
  prevValue,
  nextValue,
  step,
  timestamp,
});
 
export { HistoryActionTypeEnum } from '@/enums/CounterEnums';