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
  timeLimit: "",
  onEdit: () => {},
  onSave: () => {},
  onDelete: () => {},
  onTargetChange: () => {},
  onTimeChange: () => {},
};

export default function CounterGoalCard({
  counter = defaultProps.counter,
  goal = defaultProps.goal,
  isEditing = defaultProps.isEditing,
  targetValue = defaultProps.targetValue,
  timeLimit = defaultProps.timeLimit,
  onEdit = defaultProps.onEdit,
  onSave = defaultProps.onSave,
  onDelete = defaultProps.onDelete,
  onTargetChange = defaultProps.onTargetChange,
  onTimeChange = defaultProps.onTimeChange,
}) {
  const theme = useTheme();

  return renderCounterGoalCard({
    counter,
    goal,
    isEditing,
    targetValue,
    timeLimit,
    onEdit,
    onSave,
    onDelete,
    onTargetChange,
    onTimeChange,
    theme,
  });
}

const renderCounterGoalCard = ({
  counter,
  goal,
  isEditing,
  targetValue,
  timeLimit,
  onEdit,
  onSave,
  onDelete,
  onTargetChange,
  onTimeChange,
  theme,
}) => (
  <View style={getCardContainerStyle(theme)}>
    {/* Header */}
    <View style={getHeaderRowStyle()}>
      <Text style={getCounterNameStyle(theme)}>
        {counter.icon} {counter.name}
      </Text>
      {goal && (
        <View style={getStatusBadgeStyle(theme)}>
          <Text style={getStatusTextStyle(theme)}>
            🎯 Active
          </Text>
        </View>
      )}
    </View>

    {/* COMPLETED */}
    {goal?.status === GoalStatusEnum.COMPLETED && !isEditing && (
      <View style={getCompletedBoxStyle(theme)}>
        <Text style={getCompletedEmojiStyle()}>🏆</Text>
        <Text style={getCompletedTextStyle(theme)}>
          Goal Achieved!
        </Text>
        <Text style={getCompletedSubTextStyle(theme)}>
          Target {goal.targetValue} reached successfully
        </Text>

        <TouchableOpacity
          onPress={onDelete}
          style={getPrimaryButtonStyle(theme)}
          activeOpacity={0.85}
        >
          <Text style={getPrimaryButtonTextStyle(theme)}>
            Set New Goal
          </Text>
        </TouchableOpacity>
      </View>
    )}

    {/* ACTIVE GOAL DISPLAY */}
    {goal?.status === GoalStatusEnum.ACTIVE && !isEditing && (
      <View style={getGoalInfoContainerStyle(theme)}>
        <View style={getGoalRowStyle()}>
          <Text style={getGoalLabelStyle(theme)}>🎯 Target</Text>
          <Text style={getGoalValueStyle(theme)}>
            {goal.targetValue}
          </Text>
        </View>

        {goal?.timeLimitHours ? (
          <View style={getGoalRowStyle()}>
            <Text style={getGoalLabelStyle(theme)}>⏱ Time Limit</Text>
            <Text style={getTimeValueStyle(theme)}>
              {goal.timeLimitHours} hours
            </Text>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={getActionRowStyle()}>
          <TouchableOpacity
            onPress={onEdit}
            style={getEditButtonStyle(theme)}
            activeOpacity={0.85}
          >
            <Text style={getEditButtonTextStyle(theme)}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            style={getDeleteButtonStyle(theme)}
            activeOpacity={0.85}
          >
            <Text style={getDeleteButtonTextStyle()}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )}

    {/* NO GOAL */}
    {!goal && !isEditing && (
      <TouchableOpacity
        onPress={onEdit}
        style={getSetGoalButtonStyle(theme)}
        activeOpacity={0.9}
      >
        <Text style={getSetGoalTextStyle(theme)}>
          + Set Goal
        </Text>
      </TouchableOpacity>
    )}

    {/* EDITING */}
    {isEditing && (
      <View style={getEditorContainerStyle(theme)}>
        <GoalEditor
          value={targetValue}
          timeLimit={timeLimit}
          previousValue={
            goal?.status === GoalStatusEnum.ACTIVE
              ? goal.targetValue
              : null
          }
          onChange={onTargetChange}
          onTimeChange={onTimeChange}
          onSave={onSave}
        />
      </View>
    )}
  </View>
);

/* ---------- STYLES ---------- */

const getCardContainerStyle = (theme) => ({
  backgroundColor: theme.card,
  padding: 18,
  borderRadius: 18,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: theme.border ?? "rgba(255,255,255,0.08)",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 6,
});

const getHeaderRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
});

const getCounterNameStyle = (theme) => ({
  fontSize: 18,
  fontWeight: "700",
  color: theme.text,
});

const getStatusBadgeStyle = (theme) => ({
  backgroundColor: theme.primary + "20",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 10,
});

const getStatusTextStyle = (theme) => ({
  fontSize: 12,
  fontWeight: "600",
  color: theme.primary ?? "#007AFF",
});

const getGoalInfoContainerStyle = (theme) => ({
  backgroundColor: theme.background + "40",
  borderRadius: 14,
  padding: 14,
});

const getGoalRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
});

const getGoalLabelStyle = (theme) => ({
  fontSize: 14,
  color: theme.mutedText ?? "#888",
  fontWeight: "500",
});

const getGoalValueStyle = (theme) => ({
  fontSize: 18,
  fontWeight: "700",
  color: theme.text,
});

const getTimeValueStyle = (theme) => ({
  fontSize: 15,
  fontWeight: "600",
  color: theme.primary ?? "#4cc9f0",
});

const getActionRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 12,
});

const getEditButtonStyle = (theme) => ({
  flex: 1,
  marginRight: 8,
  paddingVertical: 10,
  borderRadius: 10,
  backgroundColor: theme.primary + "20",
  alignItems: "center",
});

const getDeleteButtonStyle = (theme) => ({
  flex: 1,
  marginLeft: 8,
  paddingVertical: 10,
  borderRadius: 10,
  backgroundColor: "#FF3B3020",
  alignItems: "center",
});

const getEditButtonTextStyle = (theme) => ({
  color: theme.primary ?? "#007AFF",
  fontWeight: "700",
});

const getDeleteButtonTextStyle = () => ({
  color: "#FF3B30",
  fontWeight: "700",
});

const getSetGoalButtonStyle = (theme) => ({
  backgroundColor: theme.primary ?? "#007AFF",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
});

const getSetGoalTextStyle = (theme) => ({
  color: theme.onPrimary ?? "#fff",
  fontSize: 16,
  fontWeight: "700",
});

const getEditorContainerStyle = (theme) => ({
  marginTop: 8,
  padding: 12,
  borderRadius: 14,
  backgroundColor: theme.background + "60",
});

const getCompletedBoxStyle = (theme) => ({
  alignItems: "center",
  paddingVertical: 14,
});

const getCompletedEmojiStyle = () => ({
  fontSize: 36,
  marginBottom: 6,
});

const getCompletedTextStyle = (theme) => ({
  fontSize: 18,
  fontWeight: "700",
  color: theme.text,
});

const getCompletedSubTextStyle = (theme) => ({
  fontSize: 14,
  color: theme.mutedText ?? "#888",
  marginBottom: 12,
});

const getPrimaryButtonStyle = (theme) => ({
  backgroundColor: theme.primary ?? "#007AFF",
  paddingVertical: 10,
  paddingHorizontal: 24,
  borderRadius: 12,
});

const getPrimaryButtonTextStyle = (theme) => ({
  color: theme.onPrimary ?? "#fff",
  fontWeight: "700",
});