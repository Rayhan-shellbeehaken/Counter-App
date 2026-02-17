import { create } from 'zustand';

const MAX_HISTORY = 10;

/* ---------------------------------
   DEFAULT STRUCTURE
--------------------------------- */
const createEmptyHistory = () => ({
  past: [],
  future: [],
});

export const useHistoryStore = create((set, get) => ({
  /* ---------------------------------
     STATE
  --------------------------------- */
  historyByCounter: {},

  /* ---------------------------------
     INIT
  --------------------------------- */
  initCounter: (counterId = '') => {
    if (!counterId) return;

    set((state) => {
      if (state.historyByCounter[counterId]) return state;

      return {
        historyByCounter: {
          ...state.historyByCounter,
          [counterId]: createEmptyHistory(),
        },
      };
    });
  },

  /* ---------------------------------
     PUSH ACTION (SOURCE OF TRUTH)
  --------------------------------- */
  pushAction: (counterId = '', action = null) => {
    if (!counterId || !action) return;

    set((state) => {
      const counterHistory =
        state.historyByCounter[counterId] ?? createEmptyHistory();

      return {
        historyByCounter: {
          ...state.historyByCounter,
          [counterId]: {
            past: [...counterHistory.past, action].slice(-MAX_HISTORY),
            future: [],
          },
        },
      };
    });
  },

  /* ---------------------------------
     UNDO
  --------------------------------- */
  undo: (counterId = '') => {
    if (!counterId) return null;

    const counterHistory =
      get().historyByCounter[counterId] ?? createEmptyHistory();

    if (counterHistory.past.length === 0) return null;

    const lastAction =
      counterHistory.past[counterHistory.past.length - 1];

    set((state) => ({
      historyByCounter: {
        ...state.historyByCounter,
        [counterId]: {
          past: counterHistory.past.slice(0, -1),
          future: [lastAction, ...counterHistory.future],
        },
      },
    }));

    return lastAction;
  },

  /* ---------------------------------
     REDO
  --------------------------------- */
  redo: (counterId = '') => {
    if (!counterId) return null;

    const counterHistory =
      get().historyByCounter[counterId] ?? createEmptyHistory();

    if (counterHistory.future.length === 0) return null;

    const nextAction = counterHistory.future[0];

    set((state) => ({
      historyByCounter: {
        ...state.historyByCounter,
        [counterId]: {
          past: [...counterHistory.past, nextAction].slice(-MAX_HISTORY),
          future: counterHistory.future.slice(1),
        },
      },
    }));

    return nextAction;
  },
}));
