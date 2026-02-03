export const createCounter = ({ name = "", color = "", step = 1 }) => ({
  id: Date.now().toString(),
  name,
  color,
  step,
  value: 0,
  createdAt: new Date().toISOString(),
});
