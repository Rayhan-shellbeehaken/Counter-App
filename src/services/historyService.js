export const applyUndo = (currentValue, action) => {
  return action.payload.prevValue;
};

export const applyRedo = (currentValue, action) => {
  return action.payload.nextValue;
};