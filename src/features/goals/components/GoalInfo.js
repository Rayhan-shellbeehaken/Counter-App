import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  goal: {},
  onEdit: () => {},
  onDelete: () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function GoalInfo({
  goal = defaultProps.goal,
  onEdit = defaultProps.onEdit,
  onDelete = defaultProps.onDelete,
}) {
  const theme = useTheme();

  return renderGoalInfo({
    goal,
    onEdit,
    onDelete,
    theme,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderGoalInfo = ({
  goal = {},
  onEdit,
  onDelete,
  theme,
}) => {
  const hasTimeLimit =
    goal?.timeLimitHours !== null &&
    goal?.timeLimitHours !== undefined &&
    goal?.timeLimitHours > 0;

  return (
    <View style={getBoxStyle(theme)}>
      {/* Target Value */}
      <Text style={getTargetTextStyle(theme)}>
        🎯 Target: {goal?.targetValue ?? 0}
      </Text>

      {/* 🔴 NEW: Time Limit Display */}
      {hasTimeLimit && (
        <Text style={getTimeTextStyle(theme)}>
         ⏱ Time Limit: {goal.timeLimitHours} min
          {goal.timeLimitHours > 1 ? 's' : ''}
        </Text>
      )}

      {/* Actions */}
      <View style={getActionsStyle()}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={getEditStyle(theme)}>
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
          <Text style={getDeleteStyle(theme)}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ---------------------------------
   STYLES (THEME-AWARE)
--------------------------------- */

const getBoxStyle = (theme) => ({
  backgroundColor: theme.card,
  padding: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.border ?? 'rgba(255,255,255,0.08)',
});

const getTargetTextStyle = (theme) => ({
  fontWeight: '700',
  fontSize: 15,
  color: theme.text,
});

const getTimeTextStyle = (theme) => ({
  marginTop: 4,
  fontSize: 13,
  fontWeight: '500',
  color: theme.mutedText ?? '#888',
});

const getActionsStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
});

const getEditStyle = (theme) => ({
  color: theme.primary ?? theme.text,
  fontWeight: '600',
});

const getDeleteStyle = (theme) => ({
  color: theme.danger ?? '#FF3B30',
  fontWeight: '600',
});