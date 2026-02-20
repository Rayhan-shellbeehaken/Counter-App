import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { useCounterStore } from '@/store/counterStore';
import { useHistoryStore } from '@/store/historyStore';
import { useGoalStore } from '@/store/goalStore';
import { useTheme } from '@/hooks/useTheme';
import { TimePeriodEnum } from '@/enums/AnalyticsEnums';
import { GoalStatusEnum } from '@/enums/GoalEnums';

import AnalyticsHeader from '@/features/analytics/components/AnalyticsHeader';
import PeriodSelector from '@/features/analytics/components/PeriodSelector';
import CounterStatCard from '@/features/analytics/components/CounterStatCard';
import EmptyAnalyticsState from '@/features/analytics/components/EmptyAnalyticsState';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  period: TimePeriodEnum.SEVEN_DAYS,
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function AnalyticsScreen({
  period = defaultProps.period,
} = defaultProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const theme = useTheme();
  const counters = useCounterStore((state) => state.counters) ?? [];
  const historyByCounter = useHistoryStore((state) => state.historyByCounter) ?? {};
  const goals = useGoalStore((state) => state.goals) ?? [];

  const counterStatsData = buildCounterStatsData({
    counters,
    historyByCounter,
    goals,
  });

  return renderAnalyticsContent({
    theme,
    selectedPeriod,
    counterStatsData,
    onPeriodChange: setSelectedPeriod,
  });
}

/* ---------------------------------
   LOGIC
--------------------------------- */

const buildCounterStatsData = ({
  counters = [],
  historyByCounter = {},
  goals = [],
} = {}) => {
  return counters.map((counter) => {
    const counterHistory = historyByCounter[counter.id] ?? {
      past: [],
      analyticsLog: [],
    };
    
    const actions = counterHistory.analyticsLog ?? counterHistory.past ?? [];
    
    const goal = findGoalForCounter({ goals, counterId: counter.id });

    return {
      counter,
      actions,
      goal,
    };
  });
};

const findGoalForCounter = ({
  goals = [],
  counterId = '',
} = {}) => {
  return goals.find(
    (g) =>
      g.counterId === counterId &&
      (g.status === GoalStatusEnum.ACTIVE || g.status === GoalStatusEnum.COMPLETED)
  ) ?? null;
};

/* ---------------------------------
   RENDER
--------------------------------- */

const renderAnalyticsContent = ({
  theme = {},
  selectedPeriod = TimePeriodEnum.SEVEN_DAYS,
  counterStatsData = [],
  onPeriodChange = () => {},
} = {}) => (
  <ScrollView style={getContainerStyle(theme)}>
    <AnalyticsHeader theme={theme} />
    
    <PeriodSelector
      theme={theme}
      selectedPeriod={selectedPeriod}
      onPeriodChange={onPeriodChange}
    />
    
    {renderCounterStats({
      theme,
      counterStatsData,
      selectedPeriod,
    })}
    
    <View style={getSpacerStyle()} />
  </ScrollView>
);

const renderCounterStats = ({
  theme = {},
  counterStatsData = [],
  selectedPeriod = TimePeriodEnum.SEVEN_DAYS,
} = {}) => {
  if (!counterStatsData.length) {
    return <EmptyAnalyticsState theme={theme} />;
  }

  return (
    <View style={getStatsContainerStyle()}>
      {counterStatsData.map(({ counter, actions, goal }) =>
        renderCounterStatCard({
          theme,
          counter,
          actions,
          goal,
          selectedPeriod,
        })
      )}
    </View>
  );
};

const renderCounterStatCard = ({
  theme = {},
  counter = {},
  actions = [],
  goal = null,
  selectedPeriod = TimePeriodEnum.SEVEN_DAYS,
} = {}) => (
  <CounterStatCard
    key={counter.id}
    theme={theme}
    counter={counter}
    actions={actions}
    goal={goal}
    selectedPeriod={selectedPeriod}
  />
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = (theme = {}) => ({
  flex: 1,
  backgroundColor: theme.background,
  marginTop: 60,
});

const getStatsContainerStyle = () => ({
  paddingHorizontal: 12,
});

const getSpacerStyle = () => ({
  height: 30,
});