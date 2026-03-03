import React from 'react';
import { View, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  label: 'or continue with',
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function AuthDivider({
  label = defaultProps.label,
}) {
  const theme = useTheme();

  return (
    <View style={getContainerStyle()}>
      <View style={getLineStyle(theme)} />
      <Text style={getLabelStyle(theme)}>{label}</Text>
      <View style={getLineStyle(theme)} />
    </View>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = () => ({
  flexDirection:  'row',
  alignItems:     'center',
  gap:            10,
});

const getLineStyle = (theme = {}) => ({
  flex:            1,
  height:          1,
  backgroundColor: theme.border ?? '#ddd',
});

const getLabelStyle = (theme = {}) => ({
  fontSize:   13,
  color:      theme.mutedText ?? '#888',
  fontWeight: '500',
});