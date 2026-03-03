import React from 'react';
import { View, Text } from 'react-native';

import { GoalStatusEnum } from '@/enums/GoalEnums';
import {
  calculateCounterStats,
  calculateStreakStats,
  buildHeatmapData,
} from '@/services/analyticsService';

import StatRow from './StatRow';
import GoalProgressBar from './GoalProgressBar';
import StreakSection from './StreakSection';
import ActivityHeatmap from './ActivityHeatmap';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  theme: {},
  counter: {},
  actions: [],
  goal: null,
  selectedPeriod: null,
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function CounterStatCard({
  theme = defaultProps.theme,
  counter = defaultProps.counter,
  actions = defaultProps.actions,
  goal = defaultProps.goal,
  selectedPeriod = defaultProps.selectedPeriod,
} = defaultProps) {
  const stats = calculateCounterStats(counter, actions, selectedPeriod);
  const streakStats = calculateStreakStats(actions);
  const heatmapData = buildHeatmapData(actions);
  const isCompleted = goal?.status === GoalStatusEnum.COMPLETED;
  const progressValue = calculateProgressValue(isCompleted, goal, stats);

  return renderStatCard({
    theme,
    counter,
    stats,
    goal,
    isCompleted,
    progressValue,
    streakStats,
    heatmapData,
  });
}

/* ---------------------------------
   LOGIC
--------------------------------- */

const calculateProgressValue = (isCompleted = false, goal = null, stats = {}) => {
  return isCompleted ? (goal?.targetValue ?? 0) : (stats.currentValue ?? 0);
};

/* ---------------------------------
   RENDER
--------------------------------- */

const renderStatCard = ({
  theme = {},
  counter = {},
  stats = {},
  goal = null,
  isCompleted = false,
  progressValue = 0,
  streakStats = {},
  heatmapData = [],
} = {}) => (
  <View key={counter.id} style={getStatCardStyle(theme)}>
    {renderCounterNameAndIcon({ theme, counter })}
    
    {renderStatRow({ theme, stats })}
    
    {goal ? renderGoalProgressBar({ theme, progressValue, goal, isCompleted }) : null}
    
    <StreakSection theme={theme} streakStats={streakStats} />
    
    <ActivityHeatmap theme={theme} heatmapData={heatmapData} />
  </View>
);

const renderCounterNameAndIcon = ({
  theme = {},
  counter = {},
} = {}) => (
  <View style={getNameRowStyle()}>
    <Text style={getCounterIconStyle()}>{counter.icon ?? ''}</Text>
    <Text style={getCounterLabelStyle(theme)}>{counter.name ?? ''}</Text>
  </View>
);

const renderStatRow = ({
  theme = {},
  stats = {},
} = {}) => (
  <>
    <StatRow theme={theme} label="Current Value" value={`${stats.currentValue ?? 0}`} />
    <StatRow theme={theme} label="Total Changes" value={`${stats.totalChanges ?? 0}`} />
    <StatRow theme={theme} label="Avg Daily" value={`${stats.avgDaily ?? 0}`} />
  </>
);

const renderGoalProgressBar = ({
  theme = {},
  progressValue = 0,
  goal = null,
  isCompleted = false,
} = {}) => (
  <GoalProgressBar
    theme={theme}
    currentValue={progressValue}
    targetValue={goal?.targetValue ?? 0}
    isCompleted={isCompleted}
  />
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getStatCardStyle = (theme = {}) => ({
  backgroundColor: theme.card,
  padding: 14,
  borderRadius: 14,
  marginBottom: 14,
});

const getNameRowStyle = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
});

const getCounterIconStyle = () => ({
  fontSize: 24,
  marginRight: 8,
});

const getCounterLabelStyle = (theme = {}) => ({
  fontSize: 17,
  fontWeight: 'bold',
  color: theme.text,
});