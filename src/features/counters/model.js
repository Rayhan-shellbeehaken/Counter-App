import { CounterCategoryEnum, CounterIconEnum } from '@/enums/CounterEnums';

export const createCounter = ({
  name = '',
  color = '',
  step = 1,
  icon = CounterIconEnum.GENERIC,
  category = CounterCategoryEnum.GENERAL,
  minValue = null,
  maxValue = null,
  note = '', // ✅ Added
} = {}) => ({
  id: Date.now().toString(),
  name,
  color,
  icon,
  step,
  category,
  value: 0,
  minValue,
  maxValue,
  note: typeof note === 'string' ? note : '', // ✅ Defensive
  createdAt: new Date().toISOString(),
});

export { CounterIconEnum, CounterCategoryEnum } from '@/enums/CounterEnums';