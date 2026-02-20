import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GoalStatusEnum } from '@/enums/GoalEnums';
import {
  scheduleGoalReminders,
  cancelGoalNotifications,
} from '@/services/notificationService';

const defaultState = {
  goals: [],
};

export const useGoalStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      addGoal: async (goal = null) => {
        if (!goal?.id) return;

        const notificationIds = await scheduleGoalReminders(goal);

        const goalWithNotifications = {
          ...goal,
          notificationIds,
        };

        set((state) => ({
          goals: [...state.goals, goalWithNotifications],
        }));
      },

      updateGoal: async (goalId = '', updates = {}) => {
        if (!goalId) return;

        const state = get();
        const existingGoal = state.goals.find((g) => g.id === goalId);
        if (!existingGoal) return;

        await cancelGoalNotifications(existingGoal);

        const updatedGoal = {
          ...existingGoal,
          ...updates,
        };

        const notificationIds = await scheduleGoalReminders(updatedGoal);
        updatedGoal.notificationIds = notificationIds;

        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? updatedGoal : g
          ),
        }));
      },

      deleteGoal: async (goalId = '') => {
        if (!goalId) return;

        const state = get();
        const goal = state.goals.find((g) => g.id === goalId);

        if (goal) {
          await cancelGoalNotifications(goal);
        }

        set((state) => ({
          goals: state.goals.filter((g) => g.id !== goalId),
        }));
      },

      markCompleted: async (goalId = '') => {
        if (!goalId) return;

        const state = get();
        const goal = state.goals.find((g) => g.id === goalId);

        if (goal) {
          await cancelGoalNotifications(goal);
        }

        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? { ...g, status: GoalStatusEnum.COMPLETED }
              : g
          ),
        }));
      },
    }),
    {
      name: 'goal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        goals: state.goals,
      }),
    }
  )
);