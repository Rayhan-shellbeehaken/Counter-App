import React from 'react';
import { View, Text } from 'react-native';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  message: '',
};

/* ---------------------------------
   COMPONENT
   Shows a red banner for
   form-level errors (not field errors).
--------------------------------- */

export default function AuthErrorBanner({
  message = defaultProps.message,
}) {
  if (!message) return null;

  return (
    <View style={getContainerStyle()}>
      <Text style={getIconStyle()}>❌</Text>
      <Text style={getMessageStyle()}>{message}</Text>
    </View>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = () => ({
  flexDirection:   'row',
  alignItems:      'center',
  backgroundColor: '#ff4444',
  borderRadius:    12,
  padding:         14,
  shadowColor:     '#ff4444',
  shadowOffset:    { width: 0, height: 2 },
  shadowOpacity:   0.3,
  shadowRadius:    4,
  elevation:       4,
});

const getIconStyle = () => ({
  fontSize:    18,
  marginRight: 10,
});

const getMessageStyle = () => ({
  flex:       1,
  color:      '#fff',
  fontSize:   14,
  fontWeight: '600',
});