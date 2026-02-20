import React from 'react';
import { View, Text } from 'react-native';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  theme: {},
  currentValue: 0,
  targetValue: 0,
  isCompleted: false,
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function GoalProgressBar({
  theme = defaultProps.theme,
  currentValue = defaultProps.currentValue,
  targetValue = defaultProps.targetValue,
  isCompleted = defaultProps.isCompleted,
} = defaultProps) {
  const percentage = calculatePercentage(currentValue, targetValue);

  return renderGoalProgress({
    theme,
    currentValue,
    targetValue,
    isCompleted,
    percentage,
  });
}

/* ---------------------------------
   LOGIC
--------------------------------- */

const calculatePercentage = (current = 0, target = 0) => {
  return Math.min(target > 0 ? (current / target) * 100 : 0, 100);
};

/* ---------------------------------
   RENDER
--------------------------------- */

const renderGoalProgress = ({
  theme = {},
  currentValue = 0,
  targetValue = 0,
  isCompleted = false,
  percentage = 0,
} = {}) => (
  <View style={getGoalProgressWrapperStyle(theme, isCompleted)}>
    {renderProgressHeader({ theme, isCompleted, percentage })}
    {renderProgressTrack({ theme, percentage, isCompleted })}
    {renderProgressSubtext({ theme, currentValue, targetValue, isCompleted })}
  </View>
);

const renderProgressHeader = ({
  theme = {},
  isCompleted = false,
  percentage = 0,
} = {}) => (
  <View style={getGoalProgressRowStyle()}>
    <Text style={getGoalProgressTitleStyle(theme)}>
      {isCompleted ? 'Goal Reached' : 'Goal Progress'}
    </Text>
    <Text style={getGoalProgressBadgeStyle(isCompleted)}>
      {isCompleted ? '🏆 100%' : `${Math.round(percentage)}%`}
    </Text>
  </View>
);

const renderProgressTrack = ({
  theme = {},
  percentage = 0,
  isCompleted = false,
} = {}) => (
  <View style={getGoalProgressTrackStyle(theme)}>
    <View style={getGoalProgressFillStyle(theme, percentage, isCompleted)} />
  </View>
);

const renderProgressSubtext = ({
  theme = {},
  currentValue = 0,
  targetValue = 0,
  isCompleted = false,
} = {}) => (
  <Text style={getGoalProgressSubtextStyle(theme)}>
    {isCompleted
      ? `You hit your target of ${targetValue}!`
      : `${currentValue} / ${targetValue}`}
  </Text>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getGoalProgressWrapperStyle = (theme = {}, isCompleted = false) => ({
  marginTop: 12,
  padding: 10,
  borderRadius: 10,
  backgroundColor: isCompleted
    ? 'rgba(52, 199, 89, 0.15)'
    : 'rgba(0, 122, 255, 0.08)',
  borderWidth: 1,
  borderColor: isCompleted ? '#34C759' : (theme.border ?? '#444'),
});

const getGoalProgressRowStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 6,
});

const getGoalProgressTitleStyle = (theme = {}) => ({
  fontSize: 13,
  fontWeight: '600',
  color: theme.text,
});

const getGoalProgressBadgeStyle = (isCompleted = false) => ({
  fontSize: 13,
  fontWeight: 'bold',
  color: isCompleted ? '#34C759' : '#007AFF',
});

const getGoalProgressTrackStyle = (theme = {}) => ({
  height: 10,
  backgroundColor: theme.border ?? '#333',
  borderRadius: 5,
  overflow: 'hidden',
});

const getGoalProgressFillStyle = (theme = {}, percentage = 0, isCompleted = false) => ({
  height: 10,
  width: `${percentage}%`,
  backgroundColor: isCompleted ? '#34C759' : (theme.primary ?? '#007AFF'),
  borderRadius: 5,
});

const getGoalProgressSubtextStyle = (theme = {}) => ({
  fontSize: 11,
  color: theme.mutedText ?? theme.text,
  marginTop: 4,
});