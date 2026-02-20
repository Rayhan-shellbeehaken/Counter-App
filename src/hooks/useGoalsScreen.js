import { useState } from 'react';
import { useCounterStore } from '@/store/counterStore';
import { useGoalStore } from '@/store/goalStore';
import { createGoal } from '@/models/GoalModel';

const defaultState = {
  editingCounterId: null,
  targetValue: '',
};

export const useGoalsScreen = () => {
  const counters = useCounterStore((s) => s.counters);
  const goals = useGoalStore((s) => s.goals);
  const addGoal = useGoalStore((s) => s.addGoal);
  const updateGoal = useGoalStore((s) => s.updateGoal);
  const deleteGoal = useGoalStore((s) => s.deleteGoal);

  const [editingCounterId, setEditingCounterId] = useState(
    defaultState.editingCounterId
  );
  const [targetValue, setTargetValue] = useState(
    defaultState.targetValue
  );

  const resetEditor = () => {
    setEditingCounterId(null);
    setTargetValue('');
  };

  const handleEdit = ({
    counterId = '',
    existingGoal = null,
  } = {}) => {
    setEditingCounterId(counterId);
    setTargetValue(
      existingGoal?.targetValue != null
        ? String(existingGoal.targetValue)
        : ''
    );
  };

  const saveGoal = ({
    counterId = '',
    goal = null,
  } = {}) => {
    const numericTarget = Number(targetValue);
    if (!counterId || numericTarget <= 0) return;

    switch (Boolean(goal)) {
      case true:
        updateGoal(goal.id, { targetValue: numericTarget });
        break;
      default:
        addGoal(
          createGoal({
            counterId,
            targetValue: numericTarget,
          })
        );
    }

    resetEditor();
  };

  const removeGoal = (goalId = '') => {
    if (!goalId) return;
    deleteGoal(goalId);
    resetEditor();
  };

  return {
    counters,
    goals,
    editingCounterId,
    targetValue,
    setTargetValue,
    handleEdit,
    saveGoal,
    removeGoal,
  };
};