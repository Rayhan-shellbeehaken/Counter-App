import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import GoalInfo from "@/features/goals/components/GoalInfo";
import GoalEditor from "@/features/goals/components/GoalEditor";
import { useTheme } from "@/hooks/useTheme";
import { GoalStatusEnum } from "@/enums/GoalEnums";

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

    {/* ✅ COMPLETED state — goal was reached */}
    {goal?.status === GoalStatusEnum.COMPLETED && !isEditing && (
      <View style={getCompletedBoxStyle(theme)}>
        <Text style={getCompletedEmojiStyle()}>🏆</Text>
        <Text style={getCompletedTextStyle(theme)}>
          You reached your goal of {goal.targetValue}!
        </Text>
        <TouchableOpacity
          onPress={onDelete}
          style={getResetButtonStyle(theme)}
        >
          <Text style={getResetButtonTextStyle(theme)}>
            Set New Goal
          </Text>
        </TouchableOpacity>
      </View>
    )}

    {/* ACTIVE state — goal exists and is being tracked */}
    {goal?.status === GoalStatusEnum.ACTIVE && !isEditing && (
      <GoalInfo goal={goal} onEdit={onEdit} onDelete={onDelete} />
    )}

    {/* NO goal — initial state */}
    {!goal && !isEditing && (
      <TouchableOpacity onPress={onEdit}>
        <Text style={getSetGoalStyle(theme)}>Set Goal</Text>
      </TouchableOpacity>
    )}

    {/* EDITING state */}
    {isEditing && (
      <GoalEditor
        value={targetValue}
        previousValue={
          goal?.status === GoalStatusEnum.ACTIVE
            ? goal.targetValue
            : null
        }
        onChange={onTargetChange}
        onSave={onSave}
      />
    )}
  </View>
);

/* ---------------------------------
   STYLES (THEME-AWARE)
--------------------------------- */

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

const getCompletedBoxStyle = (theme) => ({
  alignItems: "center",
  paddingVertical: 10,
  gap: 6,
});

const getCompletedEmojiStyle = () => ({
  fontSize: 28,
});

const getCompletedTextStyle = (theme) => ({
  fontSize: 14,
  fontWeight: "600",
  color: theme.text,
  textAlign: "center",
});

const getResetButtonStyle = (theme) => ({
  marginTop: 6,
  paddingVertical: 8,
  paddingHorizontal: 20,
  backgroundColor: theme.primary ?? "#007AFF",
  borderRadius: 8,
});

const getResetButtonTextStyle = (theme) => ({
  color: theme.onPrimary ?? "#fff",
  fontWeight: "bold",
  fontSize: 14,
});