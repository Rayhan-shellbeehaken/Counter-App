import { create } from 'zustand';
import { GoalStatusEnum } from '@/enums/GoalEnums';

const defaultState = {
  goals: [],
};

export const useGoalStore = create((set, get) => ({
  ...defaultState,

  addGoal: (goal = null) => {
    if (!goal?.id) return;

    set((state) => ({
      goals: [...state.goals, goal],
    }));
  },

  updateGoal: (goalId = '', updates = {}) => {
    if (!goalId) return;

    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, ...updates } : g
      ),
    }));
  },

  deleteGoal: (goalId = '') => {
    if (!goalId) return;

    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId),
    }));
  },

  markCompleted: (goalId = '') => {
    if (!goalId) return;

    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId
          ? { ...g, status: GoalStatusEnum.COMPLETED }
          : g
      ),
    }));
  },
}));
