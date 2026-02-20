import React from 'react';
import { View, Text } from 'react-native';

/* ---------------------------------
   CONSTANTS
--------------------------------- */

const HEATMAP_COLORS = [
  'rgba(128,128,128,0.15)', // 0 - no activity
  'rgba(0, 122, 255, 0.25)', // 1 - light
  'rgba(0, 122, 255, 0.45)', // 2 - medium
  'rgba(0, 122, 255, 0.70)', // 3 - high
  'rgba(0, 122, 255, 1.00)', // 4 - max
];

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  theme: {},
  heatmapData: [],
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function ActivityHeatmap({
  theme = defaultProps.theme,
  heatmapData = defaultProps.heatmapData,
} = defaultProps) {
  const weeks = splitIntoWeeks(heatmapData);

  return renderHeatmap({ theme, weeks });
}

/* ---------------------------------
   LOGIC
--------------------------------- */

const splitIntoWeeks = (heatmapData = []) => {
  const weeks = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }
  return weeks;
};

/* ---------------------------------
   RENDER
--------------------------------- */

const renderHeatmap = ({
  theme = {},
  weeks = [],
} = {}) => (
  <View style={getHeatmapWrapperStyle()}>
    <Text style={getHeatmapTitleStyle(theme)}>Activity (Last 10 Weeks)</Text>
    {renderHeatmapGrid({ theme, weeks })}
    {renderHeatmapLegend({ theme })}
  </View>
);

const renderHeatmapGrid = ({
  theme = {},
  weeks = [],
} = {}) => (
  <View style={getHeatmapGridStyle()}>
    {weeks.map((week, weekIndex) => renderWeekColumn({ theme, week, weekIndex }))}
  </View>
);

const renderWeekColumn = ({
  theme = {},
  week = [],
  weekIndex = 0,
} = {}) => (
  <View key={weekIndex} style={getHeatmapColumnStyle()}>
    {week.map((day) => renderDayCell({ theme, day }))}
  </View>
);

const renderDayCell = ({
  theme = {},
  day = {},
} = {}) => (
  <View
    key={day.key}
    style={getHeatmapCellStyle(theme, day.intensity ?? 0, day.isToday ?? false)}
  />
);

const renderHeatmapLegend = ({ theme = {} } = {}) => (
  <View style={getHeatmapLegendStyle()}>
    <Text style={getHeatmapLegendLabelStyle(theme)}>Less</Text>
    {[0, 1, 2, 3, 4].map((intensity) =>
      renderLegendCell({ theme, intensity })
    )}
    <Text style={getHeatmapLegendLabelStyle(theme)}>More</Text>
  </View>
);

const renderLegendCell = ({
  theme = {},
  intensity = 0,
} = {}) => (
  <View
    key={intensity}
    style={getHeatmapLegendCellStyle(theme, intensity)}
  />
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getHeatmapWrapperStyle = () => ({
  marginTop: 14,
});

const getHeatmapTitleStyle = (theme = {}) => ({
  fontSize: 13,
  fontWeight: '600',
  color: theme.mutedText ?? theme.text,
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
});

const getHeatmapGridStyle = () => ({
  flexDirection: 'row',
  gap: 3,
});

const getHeatmapColumnStyle = () => ({
  flexDirection: 'column',
  gap: 3,
});

const getHeatmapCellStyle = (theme = {}, intensity = 0, isToday = false) => ({
  width: 14,
  height: 14,
  borderRadius: 3,
  backgroundColor: HEATMAP_COLORS[intensity],
  borderWidth: isToday ? 1.5 : 0,
  borderColor: isToday ? (theme.text ?? '#fff') : 'transparent',
});

const getHeatmapLegendStyle = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 6,
  gap: 3,
});

const getHeatmapLegendLabelStyle = (theme = {}) => ({
  fontSize: 10,
  color: theme.mutedText ?? theme.text,
  marginHorizontal: 2,
});

const getHeatmapLegendCellStyle = (theme = {}, intensity = 0) => ({
  width: 10,
  height: 10,
  borderRadius: 2,
  backgroundColor: HEATMAP_COLORS[intensity],
});