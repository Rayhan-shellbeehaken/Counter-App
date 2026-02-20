import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import { useHistoryStore } from '@/store/historyStore';
import {
  createHistoryAction,
  HistoryActionTypeEnum,
} from '@/models/HistoryAction';
import { CounterCategoryEnum } from '@/enums/CounterEnums';

import { evaluateGoalsForCounter } from '@/hooks/useGoalEvaluator';
import { getAnalyticsSnapshot } from '@/services/analyticsService';

/* ---------------------------------
   DEFAULTS
--------------------------------- */
const defaultState = {
  counters: [],
  selectedCategory: CounterCategoryEnum.GENERAL,
};

/* ---------------------------------
   STORE (PERSISTED)
--------------------------------- */
export const useCounterStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      /* ---------------------------------
         CREATE
      --------------------------------- */
      createCounter: (counter = null) => {
        if (!counter?.id) return;

        set((state) => ({
          counters: [...state.counters, counter],
        }));
      },

      /* ---------------------------------
         UPDATE
      --------------------------------- */
      updateCounter: (id = '', updates = {}) => {
        if (!id) return;

        const state = get();
        const counter = state.counters.find((c) => c.id === id);
        if (!counter) return;

        const updatedCounter = {
          ...counter,
          ...updates,
        };

        set({
          counters: state.counters.map((c) =>
            c.id === id ? updatedCounter : c
          ),
        });
      },

      /* ---------------------------------
         INCREMENT
      --------------------------------- */
      increment: (id = '', step = 1) => {
        const state = get();
        const counter = state.counters.find((c) => c.id === id);
        if (!counter) return;

        const newValue = handleMaxLimitCheck(counter, counter.value + step);

        const updatedCounter = {
          ...counter,
          value: newValue,
        };

        const action = createHistoryAction({
          type: HistoryActionTypeEnum.INCREMENT,
          counterId: id,
          prevValue: counter.value,
          nextValue: newValue,
          step,
        });

        useHistoryStore.getState().pushAction(id, action);

        set({
          counters: state.counters.map((c) =>
            c.id === id ? updatedCounter : c
          ),
        });

        evaluateGoalsForCounter({
          counter: updatedCounter,
          analytics: getAnalyticsSnapshot({
            actions: useHistoryStore.getState().analyticsHistory?.[id] ?? [],
          }),
        });
      },

      /* ---------------------------------
         DECREMENT
      --------------------------------- */
      decrement: (id = '', step = 1) => {
        const state = get();
        const counter = state.counters.find((c) => c.id === id);
        if (!counter) return;

        const newValue = handleMinLimitCheck(counter, counter.value - step);

        const updatedCounter = {
          ...counter,
          value: newValue,
        };

        const action = createHistoryAction({
          type: HistoryActionTypeEnum.DECREMENT,
          counterId: id,
          prevValue: counter.value,
          nextValue: newValue,
          step,
        });

        useHistoryStore.getState().pushAction(id, action);

        set({
          counters: state.counters.map((c) =>
            c.id === id ? updatedCounter : c
          ),
        });
      },

      /* ---------------------------------
         VALUE SETTER
      --------------------------------- */
      setCounterValue: (id = '', value = 0) => {
        set((state) => ({
          counters: state.counters.map((c) =>
            c.id === id ? { ...c, value } : c
          ),
        }));
      },

      /* ---------------------------------
         DELETE
      --------------------------------- */
      deleteCounter: (id = '') => {
        set((state) => ({
          counters: state.counters.filter((c) => c.id !== id),
        }));
      },

      /* ---------------------------------
         CATEGORY HELPERS
      --------------------------------- */
      getCategories: () => {
        const { counters } = get();
        return Array.from(new Set(counters.map((c) => c.category)));
      },

      setSelectedCategory: (category = CounterCategoryEnum.GENERAL) =>
        set({ selectedCategory: category }),

      getFilteredCounters: () => {
        const { counters, selectedCategory } = get();
        return counters.filter((c) => c.category === selectedCategory);
      },
    }),
    {
      name: 'counter-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),

      // Only persist real data (not functions)
      partialize: (state) => ({
        counters: state.counters,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);

/* ---------------------------------
   HELPERS (PURE)
--------------------------------- */
const handleMaxLimitCheck = (counter = {}, proposedValue = 0) => {
  if (counter?.maxValue == null) return proposedValue;

  if (proposedValue > counter.maxValue) {
    Alert.alert(
      '⚠️ Max Limit Reached',
      `Maximum value for ${counter.name} is ${counter.maxValue}`
    );
    return counter.maxValue;
  }

  return proposedValue;
};

const handleMinLimitCheck = (counter = {}, proposedValue = 0) => {
  const minValue =
    typeof counter?.minValue === 'number' ? counter.minValue : 0;

  if (proposedValue < minValue) {
    Alert.alert(
      '⚠️ Min Limit Reached',
      `Minimum value for ${counter.name} is ${minValue}`
    );
    return minValue;
  }

  return proposedValue;
};