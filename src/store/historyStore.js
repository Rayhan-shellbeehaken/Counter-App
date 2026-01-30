import { create } from 'zustand';

const MAX_HISTORY = 10;

export const useHistoryStore = create((set, get) => ({
  history: {},  

  initCounter: (counterId) => {
    set(state => {
      if (state.history[counterId]) return state;
      return {
        history: {
          ...state.history,
          [counterId]: { past: [], future: [] }
        }
      };
    });
  },

  pushAction: (counterId, action) => {
    set(state => {
      const counterHistory = state.history[counterId] || { past: [], future: [] };
      const newPast = [...counterHistory.past, action].slice(-MAX_HISTORY);

      return {
        history: {
          ...state.history,
          [counterId]: {
            past: newPast,
            future: []
          }
        }
      };
    });
  },

  undo: (counterId) => {
    const { history } = get();
    const counterHistory = history[counterId];
    if (!counterHistory || counterHistory.past.length === 0) return null;

    const lastAction = counterHistory.past[counterHistory.past.length - 1];

    set(state => ({
      history: {
        ...state.history,
        [counterId]: {
          past: counterHistory.past.slice(0, -1),
          future: [lastAction, ...counterHistory.future]
        }
      }
    }));

    return lastAction;
  },

  redo: (counterId) => {
    const { history } = get();
    const counterHistory = history[counterId];
    if (!counterHistory || counterHistory.future.length === 0) return null;

    const nextAction = counterHistory.future[0];

    set(state => ({
      history: {
        ...state.history,
        [counterId]: {
          past: [...counterHistory.past, nextAction].slice(-MAX_HISTORY),
          future: counterHistory.future.slice(1)
        }
      }
    }));

    return nextAction;
  }
}));