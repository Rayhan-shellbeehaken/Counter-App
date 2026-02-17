import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCounterStore } from '@/store/counterStore';
import { useHistoryStore } from '@/store/historyStore';
import { TimePeriodEnum } from '@/enums/AnalyticsEnums';
import {
  calculateCounterStats,
  getPeriodLabel,
  getChartDataPoints,
} from '@/services/analyticsService';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  period: TimePeriodEnum.SEVEN_DAYS,
};

/* ---------------------------------
   SCREEN
--------------------------------- */

export default function AnalyticsScreen({
  period = defaultProps.period,
} = {}) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const counters = useCounterStore((state) => state.counters);

  // ✅ CORRECT KEY
  const historyByCounter = useHistoryStore(
    (state) => state.historyByCounter
  );

  const handlePeriodChange = (
    newPeriod = defaultProps.period
  ) => {
    setSelectedPeriod(newPeriod);
  };

  return renderAnalyticsContent(
    counters,
    historyByCounter ?? {},
    selectedPeriod,
    handlePeriodChange
  );
}

/* ---------------------------------
   RENDER FUNCTIONS
--------------------------------- */

const renderAnalyticsContent = (
  counters = [],
  historyByCounter = {},
  selectedPeriod,
  onPeriodChange
) => (
  <ScrollView style={getContainerStyle()}>
    {renderHeader()}
    {renderPeriodSelector(selectedPeriod, onPeriodChange)}
    {renderCounterStats(
      counters,
      historyByCounter,
      selectedPeriod
    )}
    <View style={{ height: 20 }} />
  </ScrollView>
);

const renderHeader = () => (
  <View style={getHeaderStyle()}>
    <Text style={getTitleStyle()}>Analytics</Text>
    <Text style={getSubtitleStyle()}>
      Track your counter progress
    </Text>
  </View>
);

const renderPeriodSelector = (
  selectedPeriod,
  onPeriodChange
) => (
  <View style={getPeriodSelectorStyle()}>
    {renderPeriodButton(
      TimePeriodEnum.SEVEN_DAYS,
      selectedPeriod,
      onPeriodChange
    )}
    {renderPeriodButton(
      TimePeriodEnum.THIRTY_DAYS,
      selectedPeriod,
      onPeriodChange
    )}
    {renderPeriodButton(
      TimePeriodEnum.NINETY_DAYS,
      selectedPeriod,
      onPeriodChange
    )}
  </View>
);

const renderPeriodButton = (
  period,
  selectedPeriod,
  onPeriodChange
) => (
  <TouchableOpacity
    onPress={() => onPeriodChange(period)}
    style={getPeriodButtonStyle(
      period === selectedPeriod
    )}
  >
    <Text
      style={getPeriodButtonTextStyle(
        period === selectedPeriod
      )}
    >
      {getPeriodLabel(period)}
    </Text>
  </TouchableOpacity>
);

const renderCounterStats = (
  counters = [],
  historyByCounter = {},
  selectedPeriod
) => {
  if (!counters.length) {
    return renderEmptyState();
  }

  return (
    <View style={getStatsContainerStyle()}>
      {counters.map((counter) => {
        const counterHistory =
          historyByCounter[counter.id] ?? {
            past: [],
          };

        const actions =
          counterHistory.past ?? [];

        return renderCounterStatCard(
          counter,
          actions,
          selectedPeriod
        );
      })}
    </View>
  );
};

const renderCounterStatCard = (
  counter,
  actions,
  selectedPeriod
) => {
  const stats = calculateCounterStats(
    counter,
    actions,
    selectedPeriod
  );

  return (
    <View key={counter.id} style={getStatCardStyle()}>
      {renderCounterNameAndIcon(counter)}
      {renderStatRow(
        'Current Value',
        `${stats.currentValue}`
      )}
      {renderStatRow(
        'Total Changes',
        `${stats.totalChanges}`
      )}
      {renderStatRow(
        'Avg Daily',
        `${stats.avgDaily}`
      )}
      {renderSimpleChart(actions, selectedPeriod)}
    </View>
  );
};

const renderCounterNameAndIcon = (counter) => (
  <View style={getNameRowStyle()}>
    <Text style={getCounterNameStyle()}>
      {counter.icon}
    </Text>
    <Text style={getCounterLabelStyle()}>
      {counter.name}
    </Text>
  </View>
);

const renderStatRow = (label, value) => (
  <View style={getStatRowStyle()}>
    <Text style={getStatLabelStyle()}>
      {label}:
    </Text>
    <Text style={getStatValueStyle()}>
      {value}
    </Text>
  </View>
);

const renderSimpleChart = (
  actions = [],
  selectedPeriod
) => {
  const dataPoints = getChartDataPoints(
    actions,
    selectedPeriod
  );

  if (!dataPoints.length) {
    return renderNoChartData();
  }

  const maxValue = Math.max(
    ...dataPoints.map((d) => d.value),
    1
  );

  return (
    <View style={getChartContainerStyle()}>
      <Text style={getChartTitleStyle()}>
        Progress Chart
      </Text>
      <View style={getBarsContainerStyle()}>
        {dataPoints.slice(-7).map((point, index) =>
          renderBarItem(point, maxValue, index)
        )}
      </View>
    </View>
  );
};

const renderBarItem = (
  point,
  maxValue,
  index
) => {
  const heightPercent =
    maxValue > 0
      ? (point.value / maxValue) * 100
      : 0;

  return (
    <View key={index} style={getBarItemStyle()}>
      <View style={getBarStyle(heightPercent)} />
      <Text style={getBarLabelStyle()}>
        {point.date}
      </Text>
      <Text style={getBarValueStyle()}>
        {point.value}
      </Text>
    </View>
  );
};

const renderEmptyState = () => (
  <View style={getEmptyStateStyle()}>
    <Text style={getEmptyStateTextStyle()}>
      No counters yet. Create one to see analytics!
    </Text>
  </View>
);

const renderNoChartData = () => (
  <View style={getNoChartDataStyle()}>
    <Text style={getNoChartDataTextStyle()}>
      No activity data yet
    </Text>
  </View>
);


/* ---------------------------------
   STYLES (unchanged)
--------------------------------- */

/* styles remain exactly as you provided */


/**
 * STYLES
 */

const getContainerStyle = () => ({
  flex: 1,
  backgroundColor: '#f5f5f5',
  marginTop:20,
});

const getHeaderStyle = () => ({
  paddingHorizontal: 16,
  paddingVertical: 50,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
});

const getTitleStyle = () => ({
  fontSize: 28,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
});

const getSubtitleStyle = () => ({
  fontSize: 14,
  color: '#999',
});

const getPeriodSelectorStyle = () => ({
  flexDirection: 'row',
  paddingHorizontal: 16,
  paddingVertical: 16,
  gap: 10,
  justifyContent: 'center',
});

const getPeriodButtonStyle = (isActive) => ({
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: isActive ? '#007AFF' : '#e0e0e0',
  borderWidth: isActive ? 2 : 0,
  borderColor: isActive ? '#0051ba' : 'transparent',
});

const getPeriodButtonTextStyle = (isActive) => ({
  fontSize: 13,
  fontWeight: isActive ? 'bold' : '500',
  color: isActive ? '#fff' : '#666',
});

const getStatsContainerStyle = () => ({
  paddingHorizontal: 16,
  gap: 12,
  paddingBottom: 16,
});

const getStatCardStyle = () => ({
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 16,
  borderWidth: 1,
  borderColor: '#eee',
});

const getNameRowStyle = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
});

const getCounterNameStyle = () => ({
  fontSize: 32,
  marginRight: 12,
});

const getCounterLabelStyle = () => ({
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
});

const getStatRowStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#f5f5f5',
});

const getStatLabelStyle = () => ({
  fontSize: 14,
  color: '#666',
  fontWeight: '500',
});

const getStatValueStyle = () => ({
  fontSize: 14,
  fontWeight: 'bold',
  color: '#007AFF',
});

const getChartContainerStyle = () => ({
  marginTop: 16,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
});

const getChartTitleStyle = () => ({
  fontSize: 13,
  fontWeight: 'bold',
  color: '#666',
  marginBottom: 12,
});

const getBarsContainerStyle = () => ({
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  height: 120,
  gap: 6,
});

const getBarItemStyle = () => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const getBarStyle = (heightPercent) => ({
  width: '100%',
  height: `${Math.max(heightPercent, 5)}%`,
  backgroundColor: '#007AFF',
  borderRadius: 4,
  marginBottom: 6,
});

const getBarLabelStyle = () => ({
  fontSize: 10,
  color: '#999',
  marginTop: 4,
});

const getBarValueStyle = () => ({
  fontSize: 10,
  color: '#333',
  fontWeight: 'bold',
  marginTop: 2,
});

const getEmptyStateStyle = () => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 16,
  minHeight: 400,
});

const getEmptyStateTextStyle = () => ({
  fontSize: 16,
  color: '#999',
  textAlign: 'center',
});

const getNoChartDataStyle = () => ({
  alignItems: 'center',
  paddingVertical: 16,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  marginTop: 12,
});

const getNoChartDataTextStyle = () => ({
  fontSize: 13,
  color: '#999',
});
