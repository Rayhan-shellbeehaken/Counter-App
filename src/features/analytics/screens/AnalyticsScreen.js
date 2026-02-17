import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useCounterStore } from "@/store/counterStore";
import { useHistoryStore } from "@/store/historyStore";
import { useGoalStore } from "@/store/goalStore";
import { TimePeriodEnum } from "@/enums/AnalyticsEnums";
import { GoalStatusEnum } from "@/enums/GoalEnums";
import {
  calculateCounterStats,
  getPeriodLabel,
  calculateStreakStats,
  buildHeatmapData,
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
  const historyByCounter = useHistoryStore((state) => state.historyByCounter) ?? {};
  const goals = useGoalStore((state) => state.goals) ?? [];

  return renderAnalyticsContent(
    theme,
    counters,
    historyByCounter,
    goals,
    selectedPeriod,
    setSelectedPeriod,
  );
}

const renderAnalyticsContent = (
  theme,
  counters,
  historyByCounter,
  goals,
  selectedPeriod,
  onPeriodChange,
) => (
  <ScrollView style={getContainerStyle(theme)}>
    {renderHeader(theme)}
    {renderPeriodSelector(theme, selectedPeriod, onPeriodChange)}
    {renderCounterStats(theme, counters, historyByCounter, goals, selectedPeriod)}
    <View style={{ height: 30 }} />
  </ScrollView>
);

/* ---------------------------------
   HEADER
--------------------------------- */
const renderHeader = (theme) => (
  <View style={getHeaderStyle()}>
    <Text style={getTitleStyle(theme)}>Analytics</Text>
    <Text style={getSubtitleStyle(theme)}>Track your counter progress</Text>
  </View>
);

/* ---------------------------------
   PERIOD SELECTOR
--------------------------------- */
const renderPeriodSelector = (theme, selectedPeriod, onPeriodChange) => (
  <View style={getPeriodSelectorStyle()}>
    {[
      TimePeriodEnum.SEVEN_DAYS,
      TimePeriodEnum.THIRTY_DAYS,
      TimePeriodEnum.NINETY_DAYS,
    ].map((p) => renderPeriodButton(theme, p, selectedPeriod, onPeriodChange))}
  </View>
);

const renderPeriodButton = (theme, period, selectedPeriod, onPeriodChange) => {
  const isActive = period === selectedPeriod;
  return (
    <TouchableOpacity
      key={period}
      onPress={() => onPeriodChange(period)}
      style={getPeriodButtonStyle(theme, isActive)}
    >
      <Text style={getPeriodButtonTextStyle(theme, isActive)}>
        {getPeriodLabel(period)}
      </Text>
    </TouchableOpacity>
  );
};

/* ---------------------------------
   COUNTER STATS LIST
--------------------------------- */
const renderCounterStats = (
  theme,
  counters,
  historyByCounter,
  goals,
  selectedPeriod,
) => {
  if (!counters.length) return renderEmptyState(theme);

  return (
    <View style={getStatsContainerStyle()}>
      {counters.map((counter) => {
        const counterHistory = historyByCounter[counter.id] ?? {
          past: [],
          analyticsLog: [],
        };
        const actions = counterHistory.analyticsLog ?? counterHistory.past ?? [];
        const goal =
          goals.find(
            (g) =>
              g.counterId === counter.id &&
              (g.status === GoalStatusEnum.ACTIVE ||
                g.status === GoalStatusEnum.COMPLETED),
          ) ?? null;

        return renderCounterStatCard(theme, counter, actions, goal, selectedPeriod);
      })}
    </View>
  );
};

/* ---------------------------------
   STAT CARD
--------------------------------- */
const renderCounterStatCard = (theme, counter, actions, goal, selectedPeriod) => {
  const stats = calculateCounterStats(counter, actions, selectedPeriod);
  const streakStats = calculateStreakStats(actions);
  const heatmapData = buildHeatmapData(actions);
  const isCompleted = goal?.status === GoalStatusEnum.COMPLETED;
  const progressValue = isCompleted ? goal.targetValue : stats.currentValue;

  return (
    <View key={counter.id} style={getStatCardStyle(theme)}>

      {renderCounterNameAndIcon(theme, counter)}

      {renderStatRow(theme, "Current Value", `${stats.currentValue}`)}
      {renderStatRow(theme, "Total Changes", `${stats.totalChanges}`)}
      {renderStatRow(theme, "Avg Daily", `${stats.avgDaily}`)}

      {goal
        ? renderGoalProgress(theme, progressValue, goal.targetValue, isCompleted)
        : null}

      {renderStreakSection(theme, streakStats)}
      {renderHeatmap(theme, heatmapData)}

    </View>
  );
};

/* ---------------------------------
   GOAL PROGRESS BAR
--------------------------------- */
const renderGoalProgress = (theme, currentValue, targetValue, isCompleted) => {
  const pct = Math.min(
    targetValue > 0 ? (currentValue / targetValue) * 100 : 0,
    100,
  );

  return (
    <View style={getGoalProgressWrapperStyle(theme, isCompleted)}>
      <View style={getGoalProgressRowStyle()}>
        <Text style={getGoalProgressTitleStyle(theme)}>
          {isCompleted ? "Goal Reached" : "Goal Progress"}
        </Text>
        <Text style={getGoalProgressBadgeStyle(isCompleted)}>
          {isCompleted ? "🏆 100%" : `${Math.round(pct)}%`}
        </Text>
      </View>
      <View style={getGoalProgressTrackStyle(theme)}>
        <View style={getGoalProgressFillStyle(theme, pct, isCompleted)} />
      </View>
      <Text style={getGoalProgressSubtextStyle(theme)}>
        {isCompleted
          ? `You hit your target of ${targetValue}!`
          : `${currentValue} / ${targetValue}`}
      </Text>
    </View>
  );
};

/* ---------------------------------
   STREAK SECTION
--------------------------------- */
const renderStreakSection = (theme, streakStats) => (
  <View style={getStreakSectionStyle(theme)}>
    <Text style={getStreakSectionTitleStyle(theme)}>Activity Streak</Text>
    <View style={getStreakRowStyle()}>

      <View style={getStreakBoxStyle(theme, true)}>
        <Text style={getStreakEmojiStyle()}>🔥</Text>
        <Text style={getStreakNumberStyle(theme, true)}>
          {streakStats.currentStreak}
        </Text>
        <Text style={getStreakLabelStyle(theme)}>Current</Text>
      </View>

      <View style={getStreakBoxStyle(theme, false)}>
        <Text style={getStreakEmojiStyle()}>🏅</Text>
        <Text style={getStreakNumberStyle(theme, false)}>
          {streakStats.bestStreak}
        </Text>
        <Text style={getStreakLabelStyle(theme)}>Best</Text>
      </View>

      <View style={getStreakBoxStyle(theme, false)}>
        <Text style={getStreakEmojiStyle()}>📅</Text>
        <Text style={getStreakNumberStyle(theme, false)}>
          {streakStats.totalActiveDays}
        </Text>
        <Text style={getStreakLabelStyle(theme)}>Total Days</Text>
      </View>

    </View>
  </View>
);

/* ---------------------------------
   HEATMAP (10 weeks × 7 days)
--------------------------------- */
const renderHeatmap = (theme, heatmapData) => {
  // Split 70 days into 10 columns of 7
  const weeks = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  return (
    <View style={getHeatmapWrapperStyle()}>
      <Text style={getHeatmapTitleStyle(theme)}>Activity (Last 10 Weeks)</Text>
      <View style={getHeatmapGridStyle()}>
        {weeks.map((week, wi) => (
          <View key={wi} style={getHeatmapColumnStyle()}>
            {week.map((day) => (
              <View
                key={day.key}
                style={getHeatmapCellStyle(theme, day.intensity, day.isToday)}
              />
            ))}
          </View>
        ))}
      </View>
      {renderHeatmapLegend(theme)}
    </View>
  );
};

const renderHeatmapLegend = (theme) => (
  <View style={getHeatmapLegendStyle()}>
    <Text style={getHeatmapLegendLabelStyle(theme)}>Less</Text>
    {[0, 1, 2, 3, 4].map((intensity) => (
      <View
        key={intensity}
        style={getHeatmapLegendCellStyle(theme, intensity)}
      />
    ))}
    <Text style={getHeatmapLegendLabelStyle(theme)}>More</Text>
  </View>
);

/* ---------------------------------
   NAME / ICON
--------------------------------- */
const renderCounterNameAndIcon = (theme, counter) => (
  <View style={getNameRowStyle()}>
    <Text style={getCounterIconStyle()}>{counter.icon}</Text>
    <Text style={getCounterLabelStyle(theme)}>{counter.name}</Text>
  </View>
);

/* ---------------------------------
   STAT ROW
--------------------------------- */
const renderStatRow = (theme, label, value) => (
  <View style={getStatRowStyle()}>
    <Text style={getStatLabelStyle(theme)}>{label}:</Text>
    <Text style={getStatValueStyle(theme)}>{value}</Text>
  </View>
);

/* ---------------------------------
   EMPTY STATE
--------------------------------- */
const renderEmptyState = (theme) => (
  <View style={getEmptyStateStyle()}>
    <Text style={getEmptyStateTextStyle(theme)}>
      No counters yet. Create one to see analytics!
    </Text>
  </View>
);

/* ===================================
   STYLES
=================================== */

const getContainerStyle = (theme) => ({
  flex: 1,
  backgroundColor: theme.background,
  marginTop: 60,
});

const getHeaderStyle = () => ({ padding: 16 });

const getTitleStyle = (theme) => ({
  fontSize: 24,
  fontWeight: "bold",
  color: theme.text,
});

const getSubtitleStyle = (theme) => ({
  fontSize: 14,
  color: theme.mutedText ?? theme.text,
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

const getStatsContainerStyle = () => ({ paddingHorizontal: 12 });

const getStatCardStyle = (theme) => ({
  backgroundColor: theme.card,
  padding: 14,
  borderRadius: 14,
  marginBottom: 14,
});

const getNameRowStyle = () => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
});

const getCounterIconStyle = () => ({ fontSize: 24, marginRight: 8 });

const getCounterLabelStyle = (theme) => ({
  fontSize: 17,
  fontWeight: "bold",
  color: theme.text,
});

const getStatRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 5,
});

const getStatLabelStyle = (theme) => ({
  color: theme.mutedText ?? theme.text,
  fontSize: 13,
});

const getStatValueStyle = (theme) => ({
  color: theme.text,
  fontWeight: "bold",
  fontSize: 13,
});

// Goal progress
const getGoalProgressWrapperStyle = (theme, isCompleted) => ({
  marginTop: 12,
  padding: 10,
  borderRadius: 10,
  backgroundColor: isCompleted
    ? "rgba(52, 199, 89, 0.15)"
    : "rgba(0, 122, 255, 0.08)",
  borderWidth: 1,
  borderColor: isCompleted ? "#34C759" : (theme.border ?? "#444"),
});

const getGoalProgressRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
});

const getGoalProgressTitleStyle = (theme) => ({
  fontSize: 13,
  fontWeight: "600",
  color: theme.text,
});

const getGoalProgressBadgeStyle = (isCompleted) => ({
  fontSize: 13,
  fontWeight: "bold",
  color: isCompleted ? "#34C759" : "#007AFF",
});

const getGoalProgressTrackStyle = (theme) => ({
  height: 10,
  backgroundColor: theme.border ?? "#333",
  borderRadius: 5,
  overflow: "hidden",
});

const getGoalProgressFillStyle = (theme, pct, isCompleted) => ({
  height: 10,
  width: `${pct}%`,
  backgroundColor: isCompleted ? "#34C759" : (theme.primary ?? "#007AFF"),
  borderRadius: 5,
});

const getGoalProgressSubtextStyle = (theme) => ({
  fontSize: 11,
  color: theme.mutedText ?? theme.text,
  marginTop: 4,
});

// Streak
const getStreakSectionStyle = (theme) => ({
  marginTop: 14,
  padding: 12,
  borderRadius: 12,
  backgroundColor: theme.background ?? "rgba(0,0,0,0.1)",
});

const getStreakSectionTitleStyle = (theme) => ({
  fontSize: 13,
  fontWeight: "600",
  color: theme.mutedText ?? theme.text,
  marginBottom: 10,
  textTransform: "uppercase",
  letterSpacing: 0.5,
});

const getStreakRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-around",
});

const getStreakBoxStyle = (theme, isHighlight) => ({
  alignItems: "center",
  padding: 10,
  borderRadius: 10,
  minWidth: 80,
  backgroundColor: isHighlight
    ? "rgba(255, 149, 0, 0.15)"
    : "rgba(128,128,128,0.08)",
  borderWidth: isHighlight ? 1 : 0,
  borderColor: isHighlight ? "#FF9500" : "transparent",
});

const getStreakEmojiStyle = () => ({
  fontSize: 22,
  marginBottom: 2,
});

const getStreakNumberStyle = (theme, isHighlight) => ({
  fontSize: 26,
  fontWeight: "bold",
  color: isHighlight ? "#FF9500" : theme.text,
});

const getStreakLabelStyle = (theme) => ({
  fontSize: 11,
  color: theme.mutedText ?? theme.text,
  marginTop: 2,
});

// Heatmap
const getHeatmapWrapperStyle = () => ({
  marginTop: 14,
});

const getHeatmapTitleStyle = (theme) => ({
  fontSize: 13,
  fontWeight: "600",
  color: theme.mutedText ?? theme.text,
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: 0.5,
});

const getHeatmapGridStyle = () => ({
  flexDirection: "row",
  gap: 3,
});

const getHeatmapColumnStyle = () => ({
  flexDirection: "column",
  gap: 3,
});

const HEATMAP_COLORS = [
  "rgba(128,128,128,0.15)",  // 0 - no activity
  "rgba(0, 122, 255, 0.25)", // 1 - light
  "rgba(0, 122, 255, 0.45)", // 2 - medium
  "rgba(0, 122, 255, 0.70)", // 3 - high
  "rgba(0, 122, 255, 1.00)", // 4 - max
];

const getHeatmapCellStyle = (theme, intensity, isToday) => ({
  width: 14,
  height: 14,
  borderRadius: 3,
  backgroundColor: HEATMAP_COLORS[intensity],
  borderWidth: isToday ? 1.5 : 0,
  borderColor: isToday ? (theme.text ?? "#fff") : "transparent",
});

const getHeatmapLegendStyle = () => ({
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6,
  gap: 3,
});

const getHeatmapLegendLabelStyle = (theme) => ({
  fontSize: 10,
  color: theme.mutedText ?? theme.text,
  marginHorizontal: 2,
});

const getHeatmapLegendCellStyle = (theme, intensity) => ({
  width: 10,
  height: 10,
  borderRadius: 2,
  backgroundColor: HEATMAP_COLORS[intensity],
});

const getEmptyStateStyle = () => ({
  padding: 20,
  alignItems: "center",
});

const getEmptyStateTextStyle = (theme) => ({
  color: theme.text,
});