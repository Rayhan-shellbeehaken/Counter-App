import { create } from 'zustand';
import { Alert } from 'react-native';
import { useHistoryStore } from '@/store/historyStore';
import { createHistoryAction, HistoryActionTypeEnum } from '@/models/HistoryAction';
import { CounterCategoryEnum } from '@/enums/CounterEnums';

 import { evaluateGoalsForCounter } from '@/hooks/useGoalEvaluator';
import { getAnalyticsSnapshot } from '@/services/analyticsService';

export const useCounterStore = create((set, get) => ({
  counters: [],
  selectedCategory: CounterCategoryEnum.GENERAL,

 
  createCounter: (counter) =>
    set((state) => ({
      counters: [...state.counters, counter],
    })),
 
 increment: (id = '', step = 1) => {
  set((state) => {
    const counter = state.counters.find((c) => c.id === id);
    if (!counter) return state;

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

evaluateGoalsForCounter({
  counter: updatedCounter,   // ✅ EXPLICIT KEY
  analytics: getAnalyticsSnapshot({
    actions: useHistoryStore.getState().analyticsHistory?.[id] ?? [],
  }),
});


    return {
      counters: state.counters.map((c) =>
        c.id === id ? updatedCounter : c
      ),
    };
  });
},

  
  decrement: (id, step = 1) => {
    set((state) => {
      const counter = state.counters.find((c) => c.id === id);
      if (!counter) return state;

      const newValue = handleMinLimitCheck(counter, counter.value - step);
      const action = createHistoryAction({
        type: HistoryActionTypeEnum.DECREMENT,
        counterId: id,
        prevValue: counter.value,
        nextValue: newValue,
        step,
      });

      useHistoryStore.getState().pushAction(id, action);

      return {
        counters: state.counters.map((c) =>
          c.id === id ? { ...c, value: newValue } : c
        ),
      };
    });
  },

 
  setCounterValue: (id, value) =>
    set((state) => ({
      counters: state.counters.map((c) =>
        c.id === id ? { ...c, value } : c
      ),
    })),

 
  deleteCounter: (id) =>
    set((state) => ({
      counters: state.counters.filter((c) => c.id !== id),
    })),

  
  getCategories: () => {
    const { counters } = get();
    const categories = new Set(counters.map((c) => c.category));
    return Array.from(categories).sort();
  },

   
  setSelectedCategory: (category) =>
    set({ selectedCategory: category }),

  
  getFilteredCounters: () => {
    const { counters, selectedCategory } = get();
    return counters.filter((c) => c.category === selectedCategory);
  },
}));

 

const handleMaxLimitCheck = (counter, proposedValue) => {
  if (counter?.maxValue === null || counter?.maxValue === undefined) {
    return proposedValue;
  }

  if (proposedValue > counter.maxValue) {
    Alert.alert(
      '⚠️ Max Limit Reached',
      `Maximum value for ${counter.name} is ${counter.maxValue}`
    );
    return counter.maxValue;
  }

  return proposedValue;
};

 
const handleMinLimitCheck = (counter, proposedValue) => {
  if (counter?.minValue === null || counter?.minValue === undefined) {
    return proposedValue;
  }

  if (proposedValue < counter.minValue) {
    Alert.alert(
      '⚠️ Min Limit Reached',
      `Minimum value for ${counter.name} is ${counter.minValue}`
    );
    return counter.minValue;
  }

  return proposedValue;
};
const updatedCounter = { ...counter, value: newValue };

evaluateGoalsForCounter({
  counter: updatedCounter,
  analytics: getAnalyticsSnapshot(id),
});
