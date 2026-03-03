import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { TimePeriodEnum } from '@/enums/AnalyticsEnums';
import { getPeriodLabel } from '@/services/analyticsService';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  theme: {},
  selectedPeriod: TimePeriodEnum.SEVEN_DAYS,
  onPeriodChange: () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function PeriodSelector({
  theme = defaultProps.theme,
  selectedPeriod = defaultProps.selectedPeriod,
  onPeriodChange = defaultProps.onPeriodChange,
} = defaultProps) {
  return renderPeriodSelector({
    theme,
    selectedPeriod,
    onPeriodChange,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderPeriodSelector = ({
  theme = {},
  selectedPeriod = TimePeriodEnum.SEVEN_DAYS,
  onPeriodChange = () => {},
} = {}) => (
  <View style={getPeriodSelectorStyle()}>
    {getPeriodOptions().map((period) =>
      renderPeriodButton({
        theme,
        period,
        selectedPeriod,
        onPeriodChange,
      })
    )}
  </View>
);

const renderPeriodButton = ({
  theme = {},
  period = TimePeriodEnum.SEVEN_DAYS,
  selectedPeriod = TimePeriodEnum.SEVEN_DAYS,
  onPeriodChange = () => {},
} = {}) => {
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
   HELPERS
--------------------------------- */

const getPeriodOptions = () => [
  TimePeriodEnum.SEVEN_DAYS,
  TimePeriodEnum.THIRTY_DAYS,
  TimePeriodEnum.NINETY_DAYS,
];

/* ---------------------------------
   STYLES
--------------------------------- */

const getPeriodSelectorStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 12,
});

const getPeriodButtonStyle = (theme = {}, isActive = false) => ({
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 12,
  backgroundColor: isActive ? theme.card : 'transparent',
});

const getPeriodButtonTextStyle = (theme = {}, isActive = false) => ({
  color: theme.text,
  fontWeight: isActive ? 'bold' : 'normal',
});