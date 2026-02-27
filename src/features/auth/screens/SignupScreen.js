import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useSignupForm } from '@/hooks/useSignupForm';
import {
  AuthButton,
  AuthHeader,
  AuthFormField,
  AuthFooter,
  AuthErrorBanner,
} from '@/features/auth/components';

/* ---------------------------------
   VALIDATION RULES
--------------------------------- */

const EMAIL_RULES = {
  required: 'Email is required',
  pattern: {
    value:   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address',
  },
};

const PASSWORD_RULES = {
  required:  'Password is required',
  minLength: {
    value:   6,
    message: 'Password must be at least 6 characters',
  },
};

// confirmPassword rules need the current password value —
// generated dynamically as a function
const getConfirmPasswordRules = (password = '') => ({
  required: 'Please confirm your password',
  validate: (value) =>
    value === password || 'Passwords do not match',
});

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  navigation: {},
};

/* ---------------------------------
   SCREEN
   No logic here — only renders.
   All state and handlers live in
   useSignupForm hook.
--------------------------------- */

export default function SignupScreen({
  navigation = defaultProps.navigation,
} = defaultProps) {
  const theme = useTheme();
  const {
    control,
    errors,
    error,
    loading,
    password,
    onSubmit,
  } = useSignupForm();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={getContainerStyle(theme)}
    >
      <ScrollView
        contentContainerStyle={getScrollStyle()}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="Create Account"
          subtitle="Sign up to get started"
        />

        <View style={getFormStyle()}>
          <AuthFormField
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            rules={EMAIL_RULES}
            error={errors.email}
            keyboardType="email-address"
          />

          <AuthFormField
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            rules={PASSWORD_RULES}
            error={errors.password}
            secureTextEntry
          />

          <AuthFormField
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            rules={getConfirmPasswordRules(password)}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <AuthErrorBanner message={error} />

          <AuthButton
            label="Sign Up"
            onPress={onSubmit}
            loading={loading}
            variant="primary"
          />
        </View>

        <AuthFooter
          message="Already have an account?"
          linkLabel="Sign In"
          onPress={() => navigation.navigate('Login')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = (theme = {}) => ({
  flex:            1,
  backgroundColor: theme.background,
});

const getScrollStyle = () => ({
  flexGrow:       1,
  justifyContent: 'center',
  padding:        24,
  gap:            16,
});

const getFormStyle = () => ({
  gap: 16,
});