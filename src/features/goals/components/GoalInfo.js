import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function GoalInfo({
  goal = {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  return renderGoalInfo({ goal, onEdit, onDelete });
}

const renderGoalInfo = ({ goal, onEdit, onDelete }) => (
  <View style={styles.box}>
    <Text style={styles.text}>🎯 Target: {goal.targetValue}</Text>

    <View style={styles.actions}>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.edit}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = {
  box: {
    backgroundColor: '#F0F8FF',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontWeight: '600',
    color: '#007AFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  edit: { color: '#007AFF' },
  delete: { color: '#FF3B30' },
};
