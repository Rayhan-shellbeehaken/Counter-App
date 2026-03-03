import { useState } from 'react';
import { useGoalStore } from '@/store/goalStore';
import { useCounterStore } from '@/store/counterStore';
import { createGoal } from '@/models/GoalModel';

export const useGoalsScreen = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoalStore();
  const counters = useCounterStore((state) => state.counters);

  const [editingCounterId, setEditingCounterId] = useState(null);
  const [targetValue, setTargetValue] = useState('');
  const [timeLimit, setTimeLimit] = useState('');

  /* ---------------------------------
     EDIT HANDLER
  --------------------------------- */
  const handleEdit = ({ counterId = '', existingGoal = null } = {}) => {
    setEditingCounterId(counterId);

    if (existingGoal) {
      // Pre-fill values when editing
      setTargetValue(String(existingGoal.targetValue ?? ''));
      setTimeLimit(
        existingGoal.timeLimitHours
          ? String(existingGoal.timeLimitHours)
          : ''
      );
    } else {
      // New goal
      setTargetValue('');
      setTimeLimit('');
    }
  };

  /* ---------------------------------
     SAVE GOAL (CREATE + UPDATE FIX)
  --------------------------------- */
  const saveGoal = async ({ counterId = '', goal = null } = {}) => {
    const parsedTarget = parseInt(targetValue, 10);
    const parsedTimeLimit = timeLimit
      ? parseInt(timeLimit, 10)
      : null;

    // Validation
    if (!counterId || isNaN(parsedTarget) || parsedTarget <= 0) {
      return;
    }

    if (
      timeLimit &&
      (isNaN(parsedTimeLimit) || parsedTimeLimit <= 0)
    ) {
      return;
    }

    /* -------------------------------
       🔴 CASE 1: UPDATE EXISTING GOAL
    --------------------------------*/
    if (goal?.id) {
      await updateGoal(goal.id, {
        targetValue: parsedTarget,
        timeLimitHours: parsedTimeLimit,
        status: goal.status, // keep status
      });
    }
    /* -------------------------------
       🟢 CASE 2: CREATE NEW GOAL
    --------------------------------*/
    else {
      const newGoal = createGoal({
        counterId,
        targetValue: parsedTarget,
        timeLimitHours: parsedTimeLimit,
      });

      await addGoal(newGoal);
    }

    // Reset editor state
    setEditingCounterId(null);
    setTargetValue('');
    setTimeLimit('');
  };

  /* ---------------------------------
     DELETE
  --------------------------------- */
  const removeGoal = async (goalId = '') => {
    if (!goalId) return;
    await deleteGoal(goalId);
  };

  return {
    counters, // REQUIRED for GoalsScreen mapping
    goals,
    editingCounterId,
    targetValue,
    timeLimit,
    setTargetValue,
    setTimeLimit,
    handleEdit,
    saveGoal,
    removeGoal,
  };
};