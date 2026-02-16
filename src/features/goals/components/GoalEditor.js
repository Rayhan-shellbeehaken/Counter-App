import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

export default function GoalEditor({
  value = '',
  onChange = () => {},
  onSave = () => {},
}) {
  return renderGoalEditor({ value, onChange, onSave });
}

const renderGoalEditor = ({ value, onChange, onSave }) => (
  <View>
    <TextInput
      placeholder="Target value"
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      style={styles.input}
    />
    <TouchableOpacity onPress={onSave} style={styles.button}>
      <Text style={styles.text}>Save</Text>
    </TouchableOpacity>
  </View>
);

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
};
