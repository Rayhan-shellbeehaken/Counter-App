import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  value:            '',
  timeLimitHours:   '',
  timeLimitMinutes: '',
  previousValue:    null,
  onChange:         () => {},
  onHoursChange:    () => {},
  onMinutesChange:  () => {},
  onSave:           () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function GoalEditor({
  value            = defaultProps.value,
  timeLimitHours   = defaultProps.timeLimitHours,
  timeLimitMinutes = defaultProps.timeLimitMinutes,
  previousValue    = defaultProps.previousValue,
  onChange         = defaultProps.onChange,
  onHoursChange    = defaultProps.onHoursChange,
  onMinutesChange  = defaultProps.onMinutesChange,
  onSave           = defaultProps.onSave,
}) {
  const theme = useTheme();

  return renderGoalEditor({
    value,
    timeLimitHours,
    timeLimitMinutes,
    previousValue,
    onChange,
    onHoursChange,
    onMinutesChange,
    onSave,
    theme,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderGoalEditor = ({
  value,
  timeLimitHours,
  timeLimitMinutes,
  previousValue,
  onChange,
  onHoursChange,
  onMinutesChange,
  onSave,
  theme,
}) => (
  <View>

    {/* Previous Goal */}
    {previousValue != null && (
      <Text style={getPreviousValueStyle(theme)}>
        Current goal: {previousValue}
      </Text>
    )}

    {/* Target Value Input */}
    <Text style={getLabelStyle(theme)}>Target Value</Text>
    <TextInput
      placeholder="e.g. 10"
      placeholderTextColor={theme.mutedText ?? '#888'}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      style={getInputStyle(theme)}
    />

    {/* 🆕 Time Limit — Hours + Minutes side by side */}
    <Text style={getLabelStyle(theme)}>Time Limit (optional)</Text>
    <View style={getTimeRowStyle()}>

      <View style={getTimeFieldWrapperStyle()}>
        <TextInput
          placeholder="0"
          placeholderTextColor={theme.mutedText ?? '#888'}
          keyboardType="numeric"
          value={timeLimitHours}
          onChangeText={onHoursChange}
          style={getTimeInputStyle(theme)}
          maxLength={2}
        />
        <Text style={getTimeUnitStyle(theme)}>hrs</Text>
      </View>

      <Text style={getTimeSeparatorStyle(theme)}>:</Text>

      <View style={getTimeFieldWrapperStyle()}>
        <TextInput
          placeholder="00"
          placeholderTextColor={theme.mutedText ?? '#888'}
          keyboardType="numeric"
          value={timeLimitMinutes}
          onChangeText={onMinutesChange}
          style={getTimeInputStyle(theme)}
          maxLength={2}
        />
        <Text style={getTimeUnitStyle(theme)}>min</Text>
      </View>

    </View>

    {/* Save Button */}
    <TouchableOpacity
      onPress={onSave}
      style={getButtonStyle(theme)}
      activeOpacity={0.85}
    >
      <Text style={getButtonTextStyle(theme)}>Save Goal</Text>
    </TouchableOpacity>

  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getLabelStyle = (theme) => ({
  fontSize:     13,
  fontWeight:   '600',
  color:        theme.mutedText ?? '#888',
  marginBottom: 6,
  marginTop:    4,
});

const getPreviousValueStyle = (theme) => ({
  fontSize:     13,
  color:        theme.mutedText ?? '#888',
  marginBottom: 8,
});

const getInputStyle = (theme) => ({
  borderWidth:      1,
  borderColor:      theme.border ?? '#ccc',
  borderRadius:     10,
  padding:          12,
  marginBottom:     14,
  color:            theme.text,
  backgroundColor:  theme.card,
  fontSize:         15,
});

const getTimeRowStyle = () => ({
  flexDirection:  'row',
  alignItems:     'center',
  marginBottom:   16,
  gap:            8,
});

const getTimeFieldWrapperStyle = () => ({
  flex:           1,
  flexDirection:  'row',
  alignItems:     'center',
  gap:            6,
});

const getTimeInputStyle = (theme) => ({
  flex:            1,
  borderWidth:     1,
  borderColor:     theme.border ?? '#ccc',
  borderRadius:    10,
  padding:         12,
  color:           theme.text,
  backgroundColor: theme.card,
  fontSize:        16,
  fontWeight:      '600',
  textAlign:       'center',
});

const getTimeUnitStyle = (theme) => ({
  fontSize:   13,
  color:      theme.mutedText ?? '#888',
  fontWeight: '500',
});

const getTimeSeparatorStyle = (theme) => ({
  fontSize:   20,
  fontWeight: '700',
  color:      theme.mutedText ?? '#888',
  marginTop:  -4,
});

const getButtonStyle = (theme) => ({
  backgroundColor: theme.primary ?? '#007AFF',
  paddingVertical: 14,
  borderRadius:    12,
  alignItems:      'center',
});

const getButtonTextStyle = (theme) => ({
  color:      theme.onPrimary ?? '#fff',
  fontWeight: 'bold',
  fontSize:   16,
});