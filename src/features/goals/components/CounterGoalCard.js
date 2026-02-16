import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import GoalInfo from '@/features/goals/components/GoalInfo';
import GoalEditor from '@/features/goals/components/GoalEditor';

const defaultProps = {
  counter: {},
  goal: null,
  isEditing: false,
};

export default function CounterGoalCard({
  counter = defaultProps.counter,
  goal = defaultProps.goal,
  isEditing = defaultProps.isEditing,
  targetValue = '',
  onEdit = () => {},
  onSave = () => {},
  onDelete = () => {},
  onTargetChange = () => {},
}) {
  return renderCounterGoalCard({
    counter,
    goal,
    isEditing,
    targetValue,
    onEdit,
    onSave,
    onDelete,
    onTargetChange,
  });
}

const renderCounterGoalCard = ({
  counter,
  goal,
  isEditing,
  targetValue,
  onEdit,
  onSave,
  onDelete,
  onTargetChange,
}) => (
  <View style={styles.card}>
    <Text style={styles.name}>
      {counter.icon} {counter.name}
    </Text>

    {goal && !isEditing && (
      <GoalInfo goal={goal} onEdit={onEdit} onDelete={onDelete} />
    )}

    {!goal && !isEditing && (
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.setGoal}>Set Goal</Text>
      </TouchableOpacity>
    )}

    {isEditing && (
      <GoalEditor
        value={targetValue}
        onChange={onTargetChange}
        onSave={onSave}
      />
    )}
  </View>
);

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  setGoal: {
    color: '#007AFF',
    fontWeight: '600',
  },
};
