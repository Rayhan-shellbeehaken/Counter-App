import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useCounterStore } from '@/store/counterStore';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  value: '',
  timeLimit: '', // NEW
  previousValue: null,
  onChange: () => {},
  onTimeChange: () => {}, // NEW
  onSave: () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function GoalEditor({
  value = defaultProps.value,
  timeLimit = defaultProps.timeLimit,
  previousValue = defaultProps.previousValue,
  onChange = defaultProps.onChange,
  onTimeChange = defaultProps.onTimeChange,
  onSave = defaultProps.onSave,
}) {
  const theme = useTheme();
  const counters = useCounterStore((state) => state.counters ?? []);

  return renderGoalEditor({
    value,
    timeLimit,
    previousValue,
    onChange,
    onTimeChange,
    onSave,
    theme,
    counters,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderGoalEditor = ({
  value,
  timeLimit,
  previousValue,
  onChange,
  onTimeChange,
  onSave,
  theme,
  counters = [],
}) => (
  <View>

    {/* Counter List */}
    {counters.length > 0 && (
      <View style={{ marginBottom: 12 }}>
        <Text style={getSectionTitleStyle(theme)}>Select Counter</Text>
        {counters.map((counter) => (
          <View key={counter.id} style={getCounterItemStyle(theme)}>
            <Text style={getCounterTextStyle(theme)}>
              {counter.icon} {counter.name}
            </Text>
          </View>
        ))}
      </View>
    )}

    {/* Previous Goal */}
    {previousValue != null && (
      <Text style={getPreviousValueStyle(theme)}>
        Current goal: {previousValue}
      </Text>
    )}

    {/* Target Value Input */}
    <TextInput
      placeholder="Enter target value"
      placeholderTextColor={theme.mutedText ?? '#888'}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      style={getInputStyle(theme)}
    />

    {/* 🔴 NEW: Time Limit Input (CRITICAL) */}
    <TextInput
      placeholder="Enter time limit (hours) e.g. 3"
      placeholderTextColor={theme.mutedText ?? '#888'}
      keyboardType="numeric"
      value={timeLimit}
      onChangeText={onTimeChange}
      style={getInputStyle(theme)}
    />

    {/* Save Button */}
    <TouchableOpacity
      onPress={onSave}
      style={getButtonStyle(theme)}
      activeOpacity={0.85}
    >
      <Text style={getButtonTextStyle(theme)}>
        Save Goal
      </Text>
    </TouchableOpacity>
  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getSectionTitleStyle = (theme) => ({
  fontSize: 15,
  fontWeight: '600',
  color: theme.text,
  marginBottom: 6,
});

const getCounterItemStyle = (theme) => ({
  padding: 10,
  borderWidth: 1,
  borderColor: theme.border ?? 'rgba(255,255,255,0.12)',
  borderRadius: 8,
  marginBottom: 6,
  backgroundColor: theme.card,
});

const getCounterTextStyle = (theme) => ({
  color: theme.text,
  fontSize: 14,
});

const getPreviousValueStyle = (theme) => ({
  fontSize: 13,
  color: theme.mutedText ?? '#888',
  marginBottom: 6,
});

const getInputStyle = (theme) => ({
  borderWidth: 1,
  borderColor: theme.border ?? '#ccc',
  borderRadius: 10,
  padding: 12,
  marginBottom: 12,
  color: theme.text,
  backgroundColor: theme.card,
});

const getButtonStyle = (theme) => ({
  backgroundColor: theme.primary ?? '#007AFF',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
});

const getButtonTextStyle = (theme) => ({
  color: theme.onPrimary ?? '#fff',
  fontWeight: 'bold',
  fontSize: 16,
});