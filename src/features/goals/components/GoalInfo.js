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
  goal,
  onEdit,
  onDelete,
  theme,
}) => (
  <View style={getBoxStyle(theme)}>
    <Text style={getTextStyle(theme)}>
      🎯 Target: {goal?.targetValue ?? 0}
    </Text>

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

/* ---------------------------------
   STYLES (THEME-AWARE)
--------------------------------- */

const getBoxStyle = (theme) => ({
  backgroundColor: theme.card,
  padding: 10,
  borderRadius: 8,
});

const getTextStyle = (theme) => ({
  fontWeight: '600',
  color: theme.text,
});

const getActionsStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 6,
});

const getEditStyle = (theme) => ({
  color: theme.text,
  fontWeight: '500',
});

const getDeleteStyle = (theme) => ({
  color: theme.danger ?? '#FF3B30',
  fontWeight: '500',
});
