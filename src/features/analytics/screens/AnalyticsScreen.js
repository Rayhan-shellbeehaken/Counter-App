import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useCounterStore } from "@/store/counterStore";
import { useHistoryStore } from "@/store/historyStore";
import { TimePeriodEnum } from "@/enums/AnalyticsEnums";
import {
  calculateCounterStats,
  getPeriodLabel,
  getChartDataPoints,
} from "@/services/analyticsService";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  period: TimePeriodEnum.SEVEN_DAYS,
};

export default function AnalyticsScreen({
  period = defaultProps.period,
} = defaultProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const theme = useTheme();

  const counters = useCounterStore((state) => state.counters) ?? [];

  const historyByCounter =
    useHistoryStore((state) => state.historyByCounter) ?? {};

  const handlePeriodChange = (newPeriod = defaultProps.period) => {
    setSelectedPeriod(newPeriod);
  };

  return renderAnalyticsContent(
    theme,
    counters,
    historyByCounter,
    selectedPeriod,
    handlePeriodChange,
  );
}

const renderAnalyticsContent = (
  theme,
  counters = [],
  historyByCounter = {},
  selectedPeriod,
  onPeriodChange,
) => (
  <ScrollView style={getContainerStyle(theme)}>
    {renderHeader(theme)}
    {renderPeriodSelector(theme, selectedPeriod, onPeriodChange)}
    {renderCounterStats(theme, counters, historyByCounter, selectedPeriod)}
    <View style={{ height: 20 }} />
  </ScrollView>
);

const renderHeader = (theme) => (
  <View style={getHeaderStyle(theme)}>
    <Text style={getTitleStyle(theme)}>Analytics</Text>
    <Text style={getSubtitleStyle(theme)}>Track your counter progress</Text>
  </View>
);

const renderPeriodSelector = (theme, selectedPeriod, onPeriodChange) => (
  <View style={getPeriodSelectorStyle()}>
    {renderPeriodButton(
      theme,
      TimePeriodEnum.SEVEN_DAYS,
      selectedPeriod,
      onPeriodChange,
    )}
    {renderPeriodButton(
      theme,
      TimePeriodEnum.THIRTY_DAYS,
      selectedPeriod,
      onPeriodChange,
    )}
    {renderPeriodButton(
      theme,
      TimePeriodEnum.NINETY_DAYS,
      selectedPeriod,
      onPeriodChange,
    )}
  </View>
);

const renderPeriodButton = (theme, period, selectedPeriod, onPeriodChange) => {
  const isActive = period === selectedPeriod;

  return (
    <TouchableOpacity
      onPress={() => onPeriodChange(period)}
      style={getPeriodButtonStyle(theme, isActive)}
    >
      <Text style={getPeriodButtonTextStyle(theme, isActive)}>
        {getPeriodLabel(period)}
      </Text>
    </TouchableOpacity>
  );
};

const renderCounterStats = (
  theme,
  counters = [],
  historyByCounter = {},
  selectedPeriod,
) => {
  if (!counters.length) {
    return renderEmptyState(theme);
  }

  return (
    <View style={getStatsContainerStyle()}>
      {counters.map((counter) => {
        const counterHistory = historyByCounter[counter.id] ?? {
          past: [],
        };

        const actions = counterHistory.past ?? [];

        return renderCounterStatCard(theme, counter, actions, selectedPeriod);
      })}
    </View>
  );
};

const renderCounterStatCard = (theme, counter, actions, selectedPeriod) => {
  const stats = calculateCounterStats(counter, actions, selectedPeriod);

  return (
    <View key={counter.id} style={getStatCardStyle(theme)}>
      {renderCounterNameAndIcon(theme, counter)}
      {renderStatRow(theme, "Current Value", `${stats.currentValue}`)}
      {renderStatRow(theme, "Total Changes", `${stats.totalChanges}`)}
      {renderStatRow(theme, "Avg Daily", `${stats.avgDaily}`)}
      {renderSimpleChart(theme, actions, selectedPeriod)}
    </View>
  );
};

const renderCounterNameAndIcon = (theme, counter) => (
  <View style={getNameRowStyle()}>
    <Text style={getCounterIconStyle()}>{counter.icon}</Text>
    <Text style={getCounterLabelStyle(theme)}>{counter.name}</Text>
  </View>
);

const renderStatRow = (theme, label, value) => (
  <View style={getStatRowStyle()}>
    <Text style={getStatLabelStyle(theme)}>{label}:</Text>
    <Text style={getStatValueStyle(theme)}>{value}</Text>
  </View>
);

const renderSimpleChart = (theme, actions = [], selectedPeriod) => {
  const dataPoints = getChartDataPoints(actions, selectedPeriod);

  if (!dataPoints.length) {
    return renderNoChartData(theme);
  }

  const maxValue = Math.max(...dataPoints.map((d) => d.value), 1);

  return (
    <View style={getChartContainerStyle()}>
      <Text style={getChartTitleStyle(theme)}>Progress Chart</Text>
      <View style={getBarsContainerStyle()}>
        {dataPoints
          .slice(-7)
          .map((point, index) => renderBarItem(theme, point, maxValue, index))}
      </View>
    </View>
  );
};

const renderBarItem = (theme, point, maxValue, index) => {
  const heightPercent = maxValue > 0 ? (point.value / maxValue) * 100 : 0;

  return (
    <View key={index} style={getBarItemStyle()}>
      <View style={getBarStyle(theme, heightPercent)} />
      <Text style={getBarLabelStyle(theme)}>{point.date}</Text>
      <Text style={getBarValueStyle(theme)}>{point.value}</Text>
    </View>
  );
};

const renderEmptyState = (theme) => (
  <View style={getEmptyStateStyle()}>
    <Text style={getEmptyStateTextStyle(theme)}>
      No counters yet. Create one to see analytics!
    </Text>
  </View>
);

const renderNoChartData = (theme) => (
  <View style={getNoChartDataStyle()}>
    <Text style={getNoChartDataTextStyle(theme)}>No activity data yet</Text>
  </View>
);

const getContainerStyle = (theme) => ({
  flex: 1,
  backgroundColor: theme.background,
  marginTop: 60,
});

const getHeaderStyle = (theme) => ({
  padding: 16,
});

const getTitleStyle = (theme) => ({
  fontSize: 24,
  fontWeight: "bold",
  color: theme.text,
});

const getSubtitleStyle = (theme) => ({
  fontSize: 14,
  color: theme.text,
});

const getPeriodSelectorStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-around",
  marginVertical: 12,
});

const getPeriodButtonStyle = (theme, isActive) => ({
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 12,
  backgroundColor: isActive ? theme.card : "transparent",
});

const getPeriodButtonTextStyle = (theme, isActive) => ({
  color: theme.text,
  fontWeight: isActive ? "bold" : "normal",
});

const getStatsContainerStyle = () => ({
  paddingHorizontal: 12,
});

const getStatCardStyle = (theme) => ({
  backgroundColor: theme.card,
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
});

const getNameRowStyle = () => ({
  flexDirection: "row",
  alignItems: "center",
});

const getCounterIconStyle = () => ({
  fontSize: 24,
  marginRight: 8,
});

const getCounterLabelStyle = (theme) => ({
  fontSize: 16,
  color: theme.text,
});

const getStatRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 6,
});

const getStatLabelStyle = (theme) => ({
  color: theme.text,
});

const getStatValueStyle = (theme) => ({
  color: theme.text,
  fontWeight: "bold",
});

const getChartContainerStyle = () => ({
  marginTop: 12,
});

const getChartTitleStyle = (theme) => ({
  color: theme.text,
  marginBottom: 6,
});

const getBarsContainerStyle = () => ({
  flexDirection: "row",
  alignItems: "flex-end",
  height: 80,
});

const getBarItemStyle = () => ({
  flex: 1,
  alignItems: "center",
});

const getBarStyle = (theme, heightPercent) => ({
  width: 8,
  height: `${heightPercent}%`,
  backgroundColor: theme.text,
  borderRadius: 4,
});

const getBarLabelStyle = (theme) => ({
  fontSize: 10,
  color: theme.text,
});

const getBarValueStyle = (theme) => ({
  fontSize: 10,
  color: theme.text,
});

const getEmptyStateStyle = () => ({
  padding: 20,
  alignItems: "center",
});

const getEmptyStateTextStyle = (theme) => ({
  color: theme.text,
});

const getNoChartDataStyle = () => ({
  padding: 12,
  alignItems: "center",
});

const getNoChartDataTextStyle = (theme) => ({
  color: theme.text,
});
