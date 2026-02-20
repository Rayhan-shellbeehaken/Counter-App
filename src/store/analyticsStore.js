import { create } from "zustand";

export const useAnalyticsStore = create(() => ({
  events: [],

  logEvent: (event = {}) => {
    if (!event.counterId || !event.timestamp) return;

    set((state) => ({
      events: [...state.events, event],
    }));
  },
}));
