import React from 'react';
import { ScrollView, Text } from 'react-native';

import { useGoalsScreen } from '@/hooks/useGoalsScreen';
import { mapCountersWithGoals } from '@/features/goals/utils/goalSelectors';
import CounterGoalCard from '@/features/goals/components/CounterGoalCard';
import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  counters: [],
  goals: [],
};

/* ---------------------------------
   SCREEN
--------------------------------- */

export default function GoalsScreen({} = defaultProps) {
  const state = useGoalsScreen();
  const theme = useTheme();

  const viewModel = buildGoalsViewModel({
    counters: state.counters,
    goals: state.goals,
  });

  return renderGoalsScreen({
    viewModel,
    state,
    theme,
  });
}

/* ---------------------------------
   VIEW MODEL (LOGIC)
--------------------------------- */

const buildGoalsViewModel = ({
  counters = defaultProps.counters,
  goals = defaultProps.goals,
} = {}) =>
  mapCountersWithGoals({
    counters,
    goals,
  });

/* ---------------------------------
   RENDER
--------------------------------- */

const renderGoalsScreen = ({
  viewModel = [],
  state,
  theme,
}) => ( 
  <ScrollView contentContainerStyle={getContainerStyle(theme)}>
    {renderHeader(theme)}

    {viewModel.map(({ counter, goal }) =>
      renderGoalCard({
        counter,
        goal,
        state,
      })
    )}
  </ScrollView>
);

const renderHeader = (theme) => (
  <>
    <Text style={getTitleStyle(theme)}>
      Goals
    </Text>
    <Text style={getSubtitleStyle(theme)}>
      Set your goals here!
    </Text>
  </>
);

const renderGoalCard = ({
  counter,
  goal,
  state,
}) => (
  <CounterGoalCard
    key={counter.id}
    counter={counter}
    goal={goal}
    isEditing={state.editingCounterId === counter.id}
    targetValue={state.targetValue}
    onEdit={() =>
      state.setEditingCounterId(counter.id)
    }
    onTargetChange={state.setTargetValue}
    onSave={() =>
      state.saveGoal({
        counterId: counter.id,
        goal,
      })
    }
    onDelete={() =>
      state.removeGoal(goal?.id)
    }
  />
);

/* ---------------------------------
   STYLES (THEME-AWARE)
--------------------------------- */

const getContainerStyle = (theme) => ({
  padding: 20,
  paddingTop: 80,
  backgroundColor: theme.background,
});

const getTitleStyle = (theme) => ({
  fontSize: 25,
  fontWeight: 'bold',
  marginBottom: 16,
  color: theme.text,
});

const getSubtitleStyle = (theme) => ({
  fontSize: 18,
  marginBottom: 16,
  color: theme.mutedText ?? theme.text,
});
