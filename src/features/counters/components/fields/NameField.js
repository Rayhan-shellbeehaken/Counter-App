import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";

import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  control: null,
  error: "",
};

export default function NameField({
  control = defaultProps.control,
  error = defaultProps.error,
} = {}) {
  const theme = useTheme();

  return renderNameField({
    control,
    error,
    theme,
  });
}

const renderNameField = ({ control, error, theme }) => (
  <Controller
    control={control}
    name="name"
    rules={{
      required: "Counter name is required",
    }}
    render={({ field }) =>
      renderFieldContent({
        field,
        error,
        theme,
      })
    }
  />
);

const renderFieldContent = ({ field, error, theme }) => (
  <View style={getContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Counter Name*</Text>

    <TextInput
      value={field.value ?? ""}
      onChangeText={field.onChange}
      placeholder="e.g. Water Intake"
      placeholderTextColor={theme.placeholder}
      style={getInputStyle(theme)}
    />

    {error ? renderErrorText(error, theme) : null}
  </View>
);

const renderErrorText = (error, theme) => (
  <Text style={getErrorTextStyle(theme)}>{error}</Text>
);

const getContainerStyle = () => ({
  marginBottom: 16,
});

const getLabelStyle = (theme) => ({
  fontWeight: "bold",
  marginBottom: 6,
  color: theme.text,
});

const getInputStyle = (theme) => ({
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 8,
  padding: 10,
  color: theme.text,
  backgroundColor: theme.card,
  borderColor: theme.text,
});

const getErrorTextStyle = (theme) => ({
  color: theme.danger,
  marginTop: 4,
});
