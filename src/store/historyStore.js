import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_HISTORY = 10; // undo/redo cap (unchanged)

/* ---------------------------------
   DEFAULT STRUCTURE
--------------------------------- */
const createEmptyHistory = () => ({
  past: [],      // capped at 10 — for undo/redo only
  future: [],
  analyticsLog: [], // unlimited — for analytics only
});

export const useHistoryStore = create(
  persist(
    (set, get) => ({
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
                // undo/redo past stays capped at 10
                past: [...counterHistory.past, action].slice(-MAX_HISTORY),
                future: [],
                // analyticsLog grows forever — never sliced
                analyticsLog: [
                  ...(counterHistory.analyticsLog ?? []),
                  action,
                ],
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
              analyticsLog: counterHistory.analyticsLog ?? [],
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
              analyticsLog: counterHistory.analyticsLog ?? [],
            },
          },
        }));

        return nextAction;
      },
    }),
    {
      name: 'history-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),

      // Persist ONLY serializable history data
      partialize: (state) => ({
        historyByCounter: state.historyByCounter,
      }),
    }
  )
);