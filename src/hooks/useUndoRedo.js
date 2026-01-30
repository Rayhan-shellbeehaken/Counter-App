import { useHistoryStore } from '@/store/historyStore';
import { applyUndo, applyRedo } from '@/services/historyService';

export const useUndoRedo = (counterId, setCounterValue) => {
  const {
    initCounter,
    pushAction,
    undo,
    redo
  } = useHistoryStore();

  const init = () => {
    initCounter(counterId);
  };

  const registerAction = (action) => {
    pushAction(counterId, action);
  };

  const handleUndo = () => {
    const action = undo(counterId);
    if (!action) return;
    const newValue = applyUndo(null, action);
    setCounterValue(newValue);
  };

  const handleRedo = () => {
    const action = redo(counterId);
    if (!action) return;
    const newValue = applyRedo(null, action);
    setCounterValue(newValue);
  };

  return {
    init,
    registerAction,
    undo: handleUndo,
    redo: handleRedo
  };
};