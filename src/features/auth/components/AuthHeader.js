import React from 'react';
import { View, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  title:    '',
  subtitle: '',
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function AuthHeader({
  title    = defaultProps.title,
  subtitle = defaultProps.subtitle,
}) {
  const theme = useTheme();

  return (
    <View style={getContainerStyle()}>
      <Text style={getTitleStyle(theme)}>{title}</Text>
      {subtitle
        ? <Text style={getSubtitleStyle(theme)}>{subtitle}</Text>
        : null
      }
    </View>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = () => ({
  marginBottom: 36,
  alignItems:   'center',
});

const getTitleStyle = (theme = {}) => ({
  fontSize:     32,
  fontWeight:   'bold',
  color:        theme.text,
  marginBottom: 8,
});

const getSubtitleStyle = (theme = {}) => ({
  fontSize: 16,
  color:    theme.mutedText ?? '#888',
});