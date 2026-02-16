import React from 'react';
import { ScrollView, Text } from 'react-native';

import { useGoalsScreen } from '@/hooks/useGoalsScreen';
import { getActiveGoalForCounter } from '@/features/goals/utils/goalSelectors';
import CounterGoalCard from '@/features/goals/components/CounterGoalCard';

const defaultProps = {};

export default function GoalsScreen({} = defaultProps) {
  const state = useGoalsScreen();
  return renderGoalsScreen(state);
}

const renderGoalsScreen = (state = {}) => (
  <ScrollView contentContainerStyle={{ padding: 20 ,marginTop:50}}>
    <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 16 }}>
      Goals
    </Text>
     <Text style={{ fontSize: 20 , marginBottom: 16 }}>
      Set your goals here!
    </Text>


    {state.counters.map((counter) => {
      const goal = getActiveGoalForCounter({
        goals: state.goals,
        counterId: counter.id,
      });

      return (
        <CounterGoalCard
          key={counter.id}
          counter={counter}
          goal={goal}
          isEditing={state.editingCounterId === counter.id}
          targetValue={state.targetValue}
          onEdit={() => state.setEditingCounterId(counter.id)}
          onTargetChange={state.setTargetValue}
          onSave={() =>
            state.saveGoal({ counterId: counter.id, goal })
          }
          onDelete={() => state.removeGoal(goal?.id)}
        />
      );
    })}
  </ScrollView>
);
