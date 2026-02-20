import React from 'react';
import { View, Text } from 'react-native';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  theme: {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function AnalyticsHeader({
  theme = defaultProps.theme,
} = defaultProps) {
  return renderHeader({ theme });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderHeader = ({ theme = {} } = {}) => (
  <View style={getHeaderStyle()}>
    <Text style={getTitleStyle(theme)}>Analytics</Text>
    <Text style={getSubtitleStyle(theme)}>Track your counter progress</Text>
  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getHeaderStyle = () => ({
  padding: 16,
});

const getTitleStyle = (theme = {}) => ({
  fontSize: 24,
  fontWeight: 'bold',
  color: theme.text,
});

const getSubtitleStyle = (theme = {}) => ({
  fontSize: 14,
  color: theme.mutedText ?? theme.text,
});