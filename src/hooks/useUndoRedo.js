import { useHistoryStore } from '@/store/historyStore';
import { useCounterStore } from '@/store/counterStore';
import { applyUndo, applyRedo } from '@/services/historyService';

export const useUndoRedo = (counterId) => {
  const {
    initCounter,
    undo,
    redo
  } = useHistoryStore();

  const { setCounterValue } = useCounterStore();

  const init = () => {
    initCounter(counterId);
  };

  const handleUndo = () => {
    const action = undo(counterId);
    if (!action) return;
    const newValue = applyUndo(action);
    setCounterValue(counterId, newValue);
  };

  const handleRedo = () => {
    const action = redo(counterId);
    if (!action) return;
    const newValue = applyRedo(action);
    setCounterValue(counterId, newValue);
  };

  return {
    init,
    undo: handleUndo,
    redo: handleRedo
  };
};