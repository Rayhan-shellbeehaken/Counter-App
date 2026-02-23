import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  navigation: {},
};

export default function SignupScreen({
  navigation = defaultProps.navigation,
} = defaultProps) {
  const theme = useTheme();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data = {}) => {
    await handleSignup(data);
  };

  const handleSignup = async ({ email = "", password = "" } = {}) => {
    setError("");
    setLoading(true);

    const result = await signup(email, password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  return renderSignupScreen({
    theme,
    control,
    errors,
    error,
    loading,
    password,
    onSubmit: handleSubmit(onSubmit),
    onNavigateToLogin: handleNavigateToLogin,
  });
}

const renderSignupScreen = ({
  theme = {},
  control = {},
  errors = {},
  error = "",
  loading = false,
  password = "",
  onSubmit = () => {},
  onNavigateToLogin = () => {},
} = {}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={getContainerStyle(theme)}
  >
    <ScrollView
      contentContainerStyle={getScrollContainerStyle()}
      keyboardShouldPersistTaps="handled"
    >
      {renderHeader({ theme })}
      {renderForm({
        theme,
        control,
        errors,
        error,
        loading,
        password,
        onSubmit,
      })}
      {renderFooter({ theme, onNavigateToLogin })}
    </ScrollView>
  </KeyboardAvoidingView>
);

const renderHeader = ({ theme = {} } = {}) => (
  <View style={getHeaderStyle()}>
    <Text style={getTitleStyle(theme)}>Create Account</Text>
    <Text style={getSubtitleStyle(theme)}>Sign up to get started</Text>
  </View>
);

const renderForm = ({
  theme = {},
  control = {},
  errors = {},
  error = "",
  loading = false,
  password = "",
  onSubmit = () => {},
} = {}) => (
  <View style={getFormContainerStyle()}>
    {renderEmailInput({ theme, control, errors })}
    {renderPasswordInput({ theme, control, errors })}
    {renderConfirmPasswordInput({ theme, control, errors, password })}
    {renderErrorMessage({ error })}
    {renderSubmitButton({ theme, loading, onSubmit })}
  </View>
);

const renderEmailInput = ({ theme = {}, control = {}, errors = {} } = {}) => (
  <View style={getInputContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Email</Text>
    <Controller
      control={control}
      name="email"
      rules={{
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={getInputStyle(theme, !!errors.email)}
          placeholder="Enter your email"
          placeholderTextColor={theme.mutedText ?? "#888"}
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
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={getInputStyle(theme, !!errors.password)}
          placeholder="Enter your password"
          placeholderTextColor={theme.mutedText ?? "#888"}
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

const renderConfirmPasswordInput = ({
  theme = {},
  control = {},
  errors = {},
  password = "",
} = {}) => (
  <View style={getInputContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Confirm Password</Text>
    <Controller
      control={control}
      name="confirmPassword"
      rules={{
        required: "Please confirm your password",
        validate: (value) => value === password || "Passwords do not match",
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={getInputStyle(theme, !!errors.confirmPassword)}
          placeholder="Confirm your password"
          placeholderTextColor={theme.mutedText ?? "#888"}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
    />
    {renderFieldError({ error: errors.confirmPassword })}
  </View>
);

const renderFieldError = ({ error = null } = {}) => {
  if (!error) return null;

  return <Text style={getFieldErrorStyle()}>{error.message}</Text>;
};

const renderErrorMessage = ({ error = "" } = {}) => {
  if (!error) return null;

  return (
    <View style={getErrorContainerStyle()}>
      <Text style={getErrorTextStyle()}>❌ {error}</Text>
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

const renderLoadingIndicator = () => <ActivityIndicator color="#fff" />;

const renderSubmitText = ({ theme = {} } = {}) => (
  <Text style={getSubmitButtonTextStyle(theme)}>Sign Up</Text>
);

const renderFooter = ({ theme = {}, onNavigateToLogin = () => {} } = {}) => (
  <View style={getFooterStyle()}>
    <Text style={getFooterTextStyle(theme)}>Already have an account?</Text>
    <TouchableOpacity onPress={onNavigateToLogin}>
      <Text style={getFooterLinkStyle(theme)}>Sign In</Text>
    </TouchableOpacity>
  </View>
);

const getContainerStyle = (theme = {}) => ({
  flex: 1,
  backgroundColor: theme.background,
});

const getScrollContainerStyle = () => ({
  flexGrow: 1,
  justifyContent: "center",
  padding: 20,
});

const getHeaderStyle = () => ({
  marginBottom: 40,
  alignItems: "center",
});

const getTitleStyle = (theme = {}) => ({
  fontSize: 32,
  fontWeight: "bold",
  color: theme.text,
  marginBottom: 8,
});

const getSubtitleStyle = (theme = {}) => ({
  fontSize: 16,
  color: theme.mutedText ?? "#888",
});

const getFormContainerStyle = () => ({
  marginBottom: 24,
});

const getInputContainerStyle = () => ({
  marginBottom: 16,
});

const getLabelStyle = (theme = {}) => ({
  fontSize: 14,
  fontWeight: "600",
  color: theme.text,
  marginBottom: 8,
});

const getInputStyle = (theme = {}, hasError = false) => ({
  borderWidth: 1,
  borderColor: hasError ? "#ff4444" : (theme.border ?? "#ddd"),
  borderRadius: 12,
  padding: 14,
  fontSize: 16,
  color: theme.text,
  backgroundColor: theme.card,
});

const getFieldErrorStyle = () => ({
  color: "#ff4444",
  fontSize: 12,
  marginTop: 4,
  marginLeft: 4,
});

const getErrorContainerStyle = () => ({
  backgroundColor: "rgba(255, 68, 68, 0.1)",
  borderWidth: 1,
  borderColor: "#ff4444",
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
});

const getErrorTextStyle = () => ({
  color: "#ff4444",
  fontSize: 14,
  textAlign: "center",
});

const getSubmitButtonStyle = (theme = {}, loading = false) => ({
  backgroundColor: loading ? theme.mutedText : (theme.primary ?? "#007AFF"),
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: "center",
  opacity: loading ? 0.7 : 1,
});

const getSubmitButtonTextStyle = (theme = {}) => ({
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
});

const getFooterStyle = () => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 24,
});

const getFooterTextStyle = (theme = {}) => ({
  fontSize: 14,
  color: theme.mutedText ?? "#888",
  marginRight: 4,
});

const getFooterLinkStyle = (theme = {}) => ({
  fontSize: 14,
  fontWeight: "bold",
  color: theme.primary ?? "#007AFF",
});
