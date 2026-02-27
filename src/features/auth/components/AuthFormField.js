import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  control:       {},
  name:          '',
  label:         '',
  placeholder:   '',
  rules:         {},
  error:         null,
  secureTextEntry: false,
  keyboardType:  'default',
  autoCapitalize: 'none',
};

/* ---------------------------------
   COMPONENT
   Single reusable field used by
   both LoginScreen and SignupScreen.
--------------------------------- */

export default function AuthFormField({
  control         = defaultProps.control,
  name            = defaultProps.name,
  label           = defaultProps.label,
  placeholder     = defaultProps.placeholder,
  rules           = defaultProps.rules,
  error           = defaultProps.error,
  secureTextEntry = defaultProps.secureTextEntry,
  keyboardType    = defaultProps.keyboardType,
  autoCapitalize  = defaultProps.autoCapitalize,
}) {
  const theme = useTheme();

  return (
    <View style={getContainerStyle()}>
      <Text style={getLabelStyle(theme)}>{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={getInputStyle(theme, !!error)}
            placeholder={placeholder}
            placeholderTextColor={theme.mutedText ?? '#888'}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
          />
        )}
      />

      {error
        ? <Text style={getErrorStyle()}>⚠️ {error.message}</Text>
        : null
      }
    </View>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = () => ({
  gap: 6,
});

const getLabelStyle = (theme = {}) => ({
  fontSize:   14,
  fontWeight: '600',
  color:      theme.text,
});

const getInputStyle = (theme = {}, hasError = false) => ({
  borderWidth:     2,
  borderColor:     hasError ? '#ff4444' : (theme.border ?? '#ddd'),
  borderRadius:    12,
  padding:         14,
  fontSize:        16,
  color:           theme.text,
  backgroundColor: theme.card ?? theme.background,
});

const getErrorStyle = () => ({
  color:      '#ff4444',
  fontSize:   13,
  fontWeight: '600',
});