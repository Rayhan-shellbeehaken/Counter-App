import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useGoalStore } from '@/store/goalStore';
import { useCounterStore } from '@/store/counterStore';
import { buildGoalDescription } from '@/services/goalDescriptionService';
import { GoalTypeEnum, GoalPeriodEnum } from '@/enums/GoalEnums';

const defaultProps = {};

export default function GoalsScreen({} = defaultProps) {
  return renderGoalsScreen();
}

/* ---------------------------------
   ROOT RENDER
--------------------------------- */

const renderGoalsScreen = () => {
  const goals = useGoalStore((state) => state.goals ?? []);
  const counters = useCounterStore((state) => state.counters ?? []);

  return goals.length === 0
    ? renderEmptyState()
    : renderGoalsList(goals, counters);
};

/* ---------------------------------
   EMPTY STATE
--------------------------------- */

const renderEmptyState = () => (
  <View style={getContainerStyle()}>
    {renderHeader()}
    {renderEmptyText()}
    {renderCreateGoalButton()}
  </View>
);

const renderHeader = () => (
  <Text style={getTitleStyle()}>Goals</Text>
);

const renderEmptyText = () => (
  <Text style={getSubtitleStyle()}>
    No goals created yet
  </Text>
);

/* ---------------------------------
   GOALS LIST
--------------------------------- */

const renderGoalsList = (
  goals = [],
  counters = []
) => (
  <View style={getContainerStyle()}>
    {renderHeader()}
    {goals.map((goal) =>
      renderGoalItem(goal, counters)
    )}
  </View>
);

const renderGoalItem = (
  goal = {},
  counters = []
) => {
  const counter =
    counters.find((c) => c.id === goal.counterId) ?? {};

  const description = buildGoalDescription({
    goal,
    counter,
  });

  return (
    <View key={goal.id} style={getGoalItemStyle()}>
      <Text style={getGoalTextStyle()}>
        {description}
      </Text>
    </View>
  );
};

/* ---------------------------------
   HANDLERS
--------------------------------- */

const handleCreateGoal = () => {
  const { addGoal } = useGoalStore.getState();
  const counters = useCounterStore.getState().counters ?? [];

  if (counters.length === 0) return;

  addGoal({
    counterId: counters[0].id, // safe default
    type: GoalTypeEnum.VALUE_TARGET,
    targetValue: 10,
    period: GoalPeriodEnum.WEEKLY,
  });
};

const renderCreateGoalButton = () => (
  <TouchableOpacity
    style={getButtonStyle()}
    onPress={handleCreateGoal}
  >
    <Text style={getButtonTextStyle()}>
      Create Goal
    </Text>
  </TouchableOpacity>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = () => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
});

const getTitleStyle = () => ({
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 8,
});

const getSubtitleStyle = () => ({
  fontSize: 14,
  color: '#666',
  marginBottom: 20,
});

const getButtonStyle = () => ({
  paddingHorizontal: 20,
  paddingVertical: 12,
  backgroundColor: '#007AFF',
  borderRadius: 8,
});

const getButtonTextStyle = () => ({
  color: '#fff',
  fontWeight: 'bold',
});

const getGoalItemStyle = () => ({
  padding: 12,
  borderRadius: 8,
  backgroundColor: '#f2f2f2',
  marginVertical: 6,
});

const getGoalTextStyle = () => ({
  fontSize: 14,
  color: '#333',
});
