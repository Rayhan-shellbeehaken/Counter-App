import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import GoalInfo from "@/features/goals/components/GoalInfo";
import GoalEditor from "@/features/goals/components/GoalEditor";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  counter: {},
  goal: null,
  isEditing: false,
  targetValue: "",
  onEdit: () => {},
  onSave: () => {},
  onDelete: () => {},
  onTargetChange: () => {},
};

export default function CounterGoalCard({
  counter = defaultProps.counter,
  goal = defaultProps.goal,
  isEditing = defaultProps.isEditing,
  targetValue = defaultProps.targetValue,
  onEdit = defaultProps.onEdit,
  onSave = defaultProps.onSave,
  onDelete = defaultProps.onDelete,
  onTargetChange = defaultProps.onTargetChange,
}) {
  const theme = useTheme();

  return renderCounterGoalCard({
    counter,
    goal,
    isEditing,
    targetValue,
    onEdit,
    onSave,
    onDelete,
    onTargetChange,
    theme,
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
  theme,
}) => (
  <View style={getCardStyle(theme)}>
    <Text style={getNameStyle(theme)}>
      {counter.icon} {counter.name}
    </Text>

    {goal && !isEditing && (
      <GoalInfo goal={goal} onEdit={onEdit} onDelete={onDelete} />
    )}

    {!goal && !isEditing && (
      <TouchableOpacity onPress={onEdit}>
        <Text style={getSetGoalStyle(theme)}>Set Goal</Text>
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

const getCardStyle = (theme) => ({
  backgroundColor: theme.card,
  padding: 16,
  borderRadius: 10,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: theme.border ?? theme.card,
});

const getNameStyle = (theme) => ({
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 8,
  color: theme.text,
});

const getSetGoalStyle = (theme) => ({
  color: theme.primary ?? "#007AFF",
  fontWeight: "600",
});
