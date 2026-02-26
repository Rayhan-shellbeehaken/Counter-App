import { useState } from 'react';
import { useGoalStore } from '@/store/goalStore';
import { useCounterStore } from '@/store/counterStore';
import { createGoal } from '@/models/GoalModel';

/* ---------------------------------
   HELPERS
--------------------------------- */

// Convert total minutes → { hours, minutes }
const splitMinutes = (totalMinutes = 0) => ({
  hours:   Math.floor(totalMinutes / 60),
  minutes: totalMinutes % 60,
});

// Combine hours + minutes → total minutes (null if both empty/zero)
const combineToMinutes = (hours = 0, minutes = 0) => {
  const total = (hours * 60) + minutes;
  return total > 0 ? total : null;
};

/* ---------------------------------
   HOOK
--------------------------------- */

export const useGoalsScreen = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoalStore();
  const counters = useCounterStore((state) => state.counters);

  const [editingCounterId, setEditingCounterId] = useState(null);
  const [targetValue,      setTargetValue]      = useState('');

  // 🆕 Split into two fields instead of one
  const [timeLimitHours,   setTimeLimitHours]   = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState('');

  /* ---------------------------------
     EDIT HANDLER
  --------------------------------- */
  const handleEdit = ({ counterId = '', existingGoal = null } = {}) => {
    setEditingCounterId(counterId);

    if (existingGoal) {
      setTargetValue(String(existingGoal.targetValue ?? ''));

      // 🆕 Split stored minutes back into hours + minutes for the inputs
      if (existingGoal.timeLimitMinutes) {
        const { hours, minutes } = splitMinutes(existingGoal.timeLimitMinutes);
        setTimeLimitHours(hours   > 0 ? String(hours)   : '');
        setTimeLimitMinutes(minutes > 0 ? String(minutes) : '');
      } else {
        setTimeLimitHours('');
        setTimeLimitMinutes('');
      }
    } else {
      setTargetValue('');
      setTimeLimitHours('');
      setTimeLimitMinutes('');
    }
  };

  /* ---------------------------------
     SAVE GOAL
  --------------------------------- */
  const saveGoal = async ({ counterId = '', goal = null } = {}) => {
    const parsedTarget  = parseInt(targetValue, 10);
    const parsedHours   = timeLimitHours   ? parseInt(timeLimitHours,   10) : 0;
    const parsedMinutes = timeLimitMinutes ? parseInt(timeLimitMinutes, 10) : 0;

    // Validate target
    if (!counterId || isNaN(parsedTarget) || parsedTarget <= 0) return;

    // Validate time fields if provided
    if (timeLimitHours   && (isNaN(parsedHours)   || parsedHours   < 0)) return;
    if (timeLimitMinutes && (isNaN(parsedMinutes) || parsedMinutes < 0 || parsedMinutes > 59)) return;

    // 🆕 Combine into total minutes
    const totalMinutes = combineToMinutes(parsedHours, parsedMinutes);

    if (goal?.id) {
      // UPDATE existing goal
      await updateGoal(goal.id, {
        targetValue:      parsedTarget,
        timeLimitMinutes: totalMinutes,
        status:           goal.status,
      });
    } else {
      // CREATE new goal
      const newGoal = createGoal({
        counterId,
        targetValue:      parsedTarget,
        timeLimitMinutes: totalMinutes,
      });
      await addGoal(newGoal);
    }

    // Reset editor
    setEditingCounterId(null);
    setTargetValue('');
    setTimeLimitHours('');
    setTimeLimitMinutes('');
  };

  /* ---------------------------------
     DELETE
  --------------------------------- */
  const removeGoal = async (goalId = '') => {
    if (!goalId) return;
    await deleteGoal(goalId);
  };

  return {
    counters,
    goals,
    editingCounterId,
    targetValue,
    timeLimitHours,
    timeLimitMinutes,
    setTargetValue,
    setTimeLimitHours,
    setTimeLimitMinutes,
    handleEdit,
    saveGoal,
    removeGoal,
  };
};