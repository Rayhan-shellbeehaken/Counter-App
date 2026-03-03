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

export default function EmptyAnalyticsState({
  theme = defaultProps.theme,
} = defaultProps) {
  return renderEmptyState({ theme });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderEmptyState = ({ theme = {} } = {}) => (
  <View style={getEmptyStateStyle()}>
    <Text style={getEmptyStateTextStyle(theme)}>
      No counters yet. Create one to see analytics!
    </Text>
  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getEmptyStateStyle = () => ({
  padding: 20,
  alignItems: 'center',
});

const getEmptyStateTextStyle = (theme = {}) => ({
  color: theme.text,
});