import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useLoginForm } from '@/hooks/useLoginForm';
import {
  AuthButton,
  AuthHeader,
  AuthFormField,
  AuthDivider,
  AuthFooter,
  AuthErrorBanner,
} from '@/features/auth/components';

/* ---------------------------------
   VALIDATION RULES
   Defined outside component —
   stable references, no re-creation.
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
   useLoginForm hook.
--------------------------------- */

export default function LoginScreen({
  navigation = defaultProps.navigation,
} = defaultProps) {
  const theme = useTheme();
  const {
    control,
    errors,
    error,
    loading,
    googleLoading,
    onSubmit,
    onGoogleLogin,
  } = useLoginForm();

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
          title="Welcome Back"
          subtitle="Sign in to continue"
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

          <AuthErrorBanner message={error} />

          <AuthButton
            label="Sign In"
            onPress={onSubmit}
            loading={loading}
            variant="primary"
          />
        </View>

        <AuthDivider />

        <AuthButton
          label="Continue with Google"
          onPress={onGoogleLogin}
          loading={googleLoading}
          variant="google"
          icon="G"
        />

        <AuthFooter
          message="Don't have an account?"
          linkLabel="Sign Up"
          onPress={() => navigation.navigate('Signup')}
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