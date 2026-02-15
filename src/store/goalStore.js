// src/store/goalStore.js

import { create } from 'zustand';

import { createGoal } from '@/models/GoalModel';
import { GoalStatusEnum } from '@/enums/GoalEnums';
import { evaluateGoal } from '@/services/goalService';
import { getAnalyticsSnapshot } from '@/services/analyticsService';

import { useCounterStore } from '@/store/counterStore';
import { useHistoryStore } from '@/store/historyStore';

const defaultState = {
  goals: [],
};

export const useGoalStore = create((set, get) => ({
  ...defaultState,

  /* ---------------------------------
     CREATE GOAL
  --------------------------------- */
  addGoal: (goalConfig = {}) =>
    set((state = defaultState) => ({
      goals: [...(state.goals ?? []), createGoal(goalConfig)],
    })),

  /* ---------------------------------
     EVALUATE GOALS FOR A COUNTER
  --------------------------------- */
  checkGoalsForCounter: (counterId = '') => {
    if (!counterId) return;

    const counter =
      useCounterStore
        .getState()
        .counters
        .find((c = {}) => c.id === counterId);

    if (!counter) return;

    const actions =
      useHistoryStore
        .getState()
        .analyticsHistory?.[counterId] ?? [];

    const analytics = getAnalyticsSnapshot({ actions });

    const { goals = [] } = get();

    goals.forEach((goal = {}) => {
      if (
        goal.counterId !== counterId ||
        goal.status === GoalStatusEnum.COMPLETED
      ) {
        return;
      }

      const status = evaluateGoal({
        goal,
        counter,
        analytics,
      });

      if (status === GoalStatusEnum.COMPLETED) {
        get().markCompleted(goal.id);
      }
    });
  },

  /* ---------------------------------
     MARK COMPLETED
  --------------------------------- */
  markCompleted: (goalId = '') =>
    set((state = defaultState) => ({
      goals: (state.goals ?? []).map((goal = {}) =>
        goal.id === goalId
          ? { ...goal, status: GoalStatusEnum.COMPLETED }
          : goal
      ),
    })),
}));
