import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  navigation: {},
};

/* ---------------------------------
   COMPONENT
--------------------------------- */


export default function LoginScreen({
  navigation = defaultProps.navigation,
} = defaultProps) {
  const theme = useTheme();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data = {}) => {
    await handleLogin(data);
  };

  const handleLogin = async ({ email = '', password = '' } = {}) => {
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result?.success) {
        const errorMessage =
          result?.error ?? 'Invalid email or password';

        setError(errorMessage);
        setLoading(false);

        Alert.alert('Login Failed', errorMessage, [
          { text: 'OK' },
        ]);
        return;
      }

      setLoading(false);
      // Navigation handled by auth state change
    } catch {
      const errorMsg =
        'An unexpected error occurred. Please try again.';

      setError(errorMsg);
      setLoading(false);

      Alert.alert('Error', errorMsg);
    }
  };

 
  const handleNavigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return renderLoginScreen({
    theme,
    control,
    errors,
    error,
    loading,
    onSubmit: handleSubmit(onSubmit),
    onNavigateToSignup: handleNavigateToSignup,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderLoginScreen = ({
  theme = {},
  control = {},
  errors = {},
  error = '',
  loading = false,
  onSubmit = () => {},
  onNavigateToSignup = () => {},
} = {}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={getContainerStyle(theme)}
  >
    <ScrollView
      contentContainerStyle={getScrollContainerStyle()}
      keyboardShouldPersistTaps="handled"
    >
      {renderHeader({ theme })}
      {renderForm({ theme, control, errors, error, loading, onSubmit })}
      {renderFooter({ theme, onNavigateToSignup })}
    </ScrollView>
  </KeyboardAvoidingView>
);

const renderHeader = ({ theme = {} } = {}) => (
  <View style={getHeaderStyle()}>
    <Text style={getTitleStyle(theme)}>Welcome Back</Text>
    <Text style={getSubtitleStyle(theme)}>Sign in to continue</Text>
  </View>
);

const renderForm = ({
  theme = {},
  control = {},
  errors = {},
  error = '',
  loading = false,
  onSubmit = () => {},
} = {}) => (
  <View style={getFormContainerStyle()}>
    {renderEmailInput({ theme, control, errors })}
    {renderPasswordInput({ theme, control, errors })}
    {renderErrorMessage({ error })}
    {renderSubmitButton({ theme, loading, onSubmit })}
  </View>
);

const renderEmailInput = ({
  theme = {},
  control = {},
  errors = {},
} = {}) => (
  <View style={getInputContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Email</Text>
    <Controller
      control={control}
      name="email"
      rules={{
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={getInputStyle(theme, !!errors.email)}
          placeholder="Enter your email"
          placeholderTextColor={theme.mutedText ?? '#888'}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
    />
    {renderFieldError({ error: errors.email })}
  </View>
);

const renderPasswordInput = ({
  theme = {},
  control = {},
  errors = {},
} = {}) => (
  <View style={getInputContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Password</Text>
    <Controller
      control={control}
      name="password"
      rules={{
        required: 'Password is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters',
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={getInputStyle(theme, !!errors.password)}
          placeholder="Enter your password"
          placeholderTextColor={theme.mutedText ?? '#888'}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
    />
    {renderFieldError({ error: errors.password })}
  </View>
);

const renderFieldError = ({ error = null } = {}) => {
  if (!error) return null;

  return (
    <Text style={getFieldErrorStyle()}>
      ⚠️ {error.message}
    </Text>
  );
};

const renderErrorMessage = ({ error = '' } = {}) => {
  if (!error) return null;

  return (
    <View style={getErrorContainerStyle()}>
      <Text style={getErrorIconStyle()}>❌</Text>
      <Text style={getErrorTextStyle()}>{error}</Text>
    </View>
  );
};

const renderSubmitButton = ({
  theme = {},
  loading = false,
  onSubmit = () => {},
} = {}) => (
  <TouchableOpacity
    style={getSubmitButtonStyle(theme, loading)}
    onPress={onSubmit}
    disabled={loading}
    activeOpacity={0.8}
  >
    {loading ? renderLoadingIndicator() : renderSubmitText({ theme })}
  </TouchableOpacity>
);

const renderLoadingIndicator = () => (
  <ActivityIndicator color="#fff" />
);

const renderSubmitText = ({ theme = {} } = {}) => (
  <Text style={getSubmitButtonTextStyle(theme)}>Sign In</Text>
);

const renderFooter = ({
  theme = {},
  onNavigateToSignup = () => {},
} = {}) => (
  <View style={getFooterStyle()}>
    <Text style={getFooterTextStyle(theme)}>Don't have an account?</Text>
    <TouchableOpacity onPress={onNavigateToSignup}>
      <Text style={getFooterLinkStyle(theme)}>Sign Up</Text>
    </TouchableOpacity>
  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = (theme = {}) => ({
  flex: 1,
  backgroundColor: theme.background,
});

const getScrollContainerStyle = () => ({
  flexGrow: 1,
  justifyContent: 'center',
  padding: 20,
});

const getHeaderStyle = () => ({
  marginBottom: 40,
  alignItems: 'center',
});

const getTitleStyle = (theme = {}) => ({
  fontSize: 32,
  fontWeight: 'bold',
  color: theme.text,
  marginBottom: 8,
});

const getSubtitleStyle = (theme = {}) => ({
  fontSize: 16,
  color: theme.mutedText ?? '#888',
});

const getFormContainerStyle = () => ({
  marginBottom: 24,
});

const getInputContainerStyle = () => ({
  marginBottom: 16,
});

const getLabelStyle = (theme = {}) => ({
  fontSize: 14,
  fontWeight: '600',
  color: theme.text,
  marginBottom: 8,
});

const getInputStyle = (theme = {}, hasError = false) => ({
  borderWidth: 2,
  borderColor: hasError ? '#ff4444' : (theme.border ?? '#ddd'),
  borderRadius: 12,
  padding: 14,
  fontSize: 16,
  color: theme.text,
  backgroundColor: theme.card,
});

const getFieldErrorStyle = () => ({
  color: '#ff4444',
  fontSize: 13,
  marginTop: 6,
  marginLeft: 4,
  fontWeight: '600',
});

const getErrorContainerStyle = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ff4444',
  borderRadius: 12,
  padding: 14,
  marginBottom: 16,
  shadowColor: '#ff4444',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
});

const getErrorIconStyle = () => ({
  fontSize: 20,
  marginRight: 10,
});

const getErrorTextStyle = () => ({
  flex: 1,
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
});

const getSubmitButtonStyle = (theme = {}, loading = false) => ({
  backgroundColor: loading ? theme.mutedText : (theme.primary ?? '#007AFF'),
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  opacity: loading ? 0.7 : 1,
  shadowColor: theme.primary ?? '#007AFF',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 3,
});

const getSubmitButtonTextStyle = (theme = {}) => ({
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
});

const getFooterStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 24,
});

const getFooterTextStyle = (theme = {}) => ({
  fontSize: 14,
  color: theme.mutedText ?? '#888',
  marginRight: 4,
});

const getFooterLinkStyle = (theme = {}) => ({
  fontSize: 14,
  fontWeight: 'bold',
  color: theme.primary ?? '#007AFF',
});