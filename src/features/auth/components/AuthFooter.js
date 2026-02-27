import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  message:   '',
  linkLabel: '',
  onPress:   () => {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function AuthFooter({
  message   = defaultProps.message,
  linkLabel = defaultProps.linkLabel,
  onPress   = defaultProps.onPress,
}) {
  const theme = useTheme();

  return (
    <View style={getContainerStyle()}>
      <Text style={getMessageStyle(theme)}>{message}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={getLinkStyle(theme)}>  {linkLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = () => ({
  flexDirection:  'row',
  justifyContent: 'center',
  alignItems:     'center',
  marginTop:      24,
});

const getMessageStyle = (theme = {}) => ({
  fontSize: 14,
  color:    theme.mutedText ?? '#888',
});

const getLinkStyle = (theme = {}) => ({
  fontSize:   14,
  fontWeight: 'bold',
  color:      theme.primary ?? '#007AFF',
});