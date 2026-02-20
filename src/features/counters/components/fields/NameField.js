import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  control: null,
  rules: {},
};

const MAX_CHAR = 20;

export default function NameField({
  control = defaultProps.control,
  rules = defaultProps.rules,
} = {}) {
  const theme = useTheme();

  return renderNameField({
    control,
    rules,
    theme,
  });
}

const renderNameField = ({ control, rules, theme }) => (
  <Controller
    control={control}
    name="name"
    rules={rules}
    render={({ field, fieldState }) =>
      renderFieldContent({
        field,
        error: fieldState.error?.message ?? "",
        theme,
      })
    }
  />
);

const renderFieldContent = ({ field = {}, error = "", theme = {} }) => {
  const value = field.value ?? "";
  const length = value.length;

  return (
    <View style={getContainerStyle()}>
      <Text style={getLabelStyle(theme)}>Counter Name*</Text>

      <TextInput
        value={value}
        onChangeText={field.onChange}
        placeholder="e.g. Water Intake"
        placeholderTextColor={theme.placeholder}
        style={getInputStyle(theme, error)}
      />

      {/* Character Counter (best UX with validation) */}
      <Text style={getCounterStyle(theme, length)}>
        {length}/{MAX_CHAR}
      </Text>

      {error ? renderErrorText(error) : null}
    </View>
  );
};

const renderErrorText = (error = "") => (
  <Text style={getErrorTextStyle()}>{error}</Text>
);

const getContainerStyle = () => ({
  marginBottom: 16,
});

const getLabelStyle = (theme = {}) => ({
  fontWeight: "bold",
  marginBottom: 6,
  color: theme.text,
});
const getInputStyle = (theme = {}, error = "") => ({
  borderWidth: 1.5,
  borderColor: error
    ? "#FF3B30"
    : theme.border ?? "#2A2A2A", // fallback for dark mode
  borderRadius: 10,
  padding: 12,
  color: theme.text,
  backgroundColor: theme.card,
});

const getCounterStyle = (theme = {}, length = 0) => ({
  marginTop: 4,
  fontSize: 12,
  textAlign: "right",
  color: length > MAX_CHAR ? "#FF3B30" : theme.placeholder,
});

const getErrorTextStyle = () => ({
  color: "#FF3B30", // always red
  marginTop: 4,
  fontSize: 12,
  fontWeight: "500",
});
