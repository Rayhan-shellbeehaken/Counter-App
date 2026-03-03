import React from 'react';
import { View, Text } from 'react-native';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  theme: {},
  label: '',
  value: '',
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function StatRow({
  theme = defaultProps.theme,
  label = defaultProps.label,
  value = defaultProps.value,
} = defaultProps) {
  return renderStatRow({ theme, label, value });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderStatRow = ({
  theme = {},
  label = '',
  value = '',
} = {}) => (
  <View style={getStatRowStyle()}>
    <Text style={getStatLabelStyle(theme)}>{label}:</Text>
    <Text style={getStatValueStyle(theme)}>{value}</Text>
  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getStatRowStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 5,
});

const getStatLabelStyle = (theme = {}) => ({
  color: theme.mutedText ?? theme.text,
  fontSize: 13,
});

const getStatValueStyle = (theme = {}) => ({
  color: theme.text,
  fontWeight: 'bold',
  fontSize: 13,
});