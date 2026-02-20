/**
 * Apply undo operation - restore previous value
 * @param {Object} action - History action object
 * @returns {number|null} - Previous value if action exists, null otherwise
 */
export const applyUndo = (action) => {
  if (!action) return null;
  return action.prevValue;
};

/**
 * Apply redo operation - restore next value
 * @param {Object} action - History action object
 * @returns {number|null} - Next value if action exists, null otherwise
 */
export const applyRedo = (action) => {
  if (!action) return null;
  return action.nextValue;
};