import { create } from 'zustand';

export const useCounterStore = create((set) => ({
  counters: [],

  createCounter: (counter) =>
    set((state) => ({
      counters: [...state.counters, counter],
    })),

  increment: (id, step = 1) =>
    set((state) => ({
      counters: state.counters.map((c) =>
        c.id === id ? { ...c, value: c.value + step } : c
      ),
    })),

  decrement: (id, step = 1) =>
    set((state) => ({
      counters: state.counters.map((c) =>
        c.id === id ? { ...c, value: c.value - step } : c
      ),
    })),
}));
