import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  value: '',
  previousValue: null,
  onChange: () => {},
  onSave: () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function GoalEditor({
  value = defaultProps.value,
  previousValue = defaultProps.previousValue,
  onChange = defaultProps.onChange,
  onSave = defaultProps.onSave,
}) {
  const theme = useTheme();

  return renderGoalEditor({
    value,
    previousValue,
    onChange,
    onSave,
    theme,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderGoalEditor = ({
  value,
  previousValue,
  onChange,
  onSave,
  theme,
}) => (
  <View>

    {/* Show previous value label if editing an existing goal */}
    {previousValue != null && (
      <Text style={getPreviousValueStyle(theme)}>
        Current goal: {previousValue}
      </Text>
    )}

    <TextInput
      placeholder={
        previousValue != null
          ? `Current: ${previousValue} — enter new value`
          : 'Enter target value'
      }
      placeholderTextColor={theme.mutedText ?? '#888'}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      style={getInputStyle(theme)}
    />

    <TouchableOpacity
      onPress={onSave}
      style={getButtonStyle(theme)}
    >
      <Text style={getButtonTextStyle(theme)}>
        Save
      </Text>
    </TouchableOpacity>
  </View>
);

/* ---------------------------------
   STYLES (THEME-AWARE)
--------------------------------- */

const getPreviousValueStyle = (theme) => ({
  fontSize: 13,
  color: theme.mutedText ?? '#888',
  marginBottom: 6,
});

const getInputStyle = (theme) => ({
  borderWidth: 1,
  borderColor: theme.border ?? '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 8,
  color: theme.text,
  backgroundColor: theme.card,
});

const getButtonStyle = (theme) => ({
  backgroundColor: theme.primary ?? '#007AFF',
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
});

const getButtonTextStyle = (theme) => ({
  color: theme.onPrimary ?? '#fff',
  fontWeight: 'bold',
});