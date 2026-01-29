export const createCounter = ({ name, color, step }) => ({
  id: Date.now().toString(),
  name,
  color,
  step,
  value: 0,
  createdAt: new Date().toISOString(),
});
