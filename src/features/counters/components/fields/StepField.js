import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  control: null,
  rules: {},
};

const STEP_OPTIONS = [1, 5, 10];

export default function StepField({
  control = defaultProps.control,
  rules = defaultProps.rules,
} = {}) {
  const theme = useTheme();

  return renderStepField({
    control,
    rules,
    theme,
  });
}

const renderStepField = ({ control, rules, theme }) => (
  <Controller
    control={control}
    name="step"
    rules={rules}
    render={({ field, fieldState }) =>
      renderFieldContent({
        value: field.value,
        onChange: field.onChange,
        error: fieldState.error?.message ?? "",
        theme,
      })
    }
  />
);

const renderFieldContent = ({
  value = "",
  onChange = () => {},
  error = "",
  theme = {},
}) => (
  <View style={getContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Step</Text>

    <View style={getRowStyle()}>
      <StepButtons value={value} onSelect={onChange} theme={theme} />
      <CustomStepInput value={value} onChange={onChange} theme={theme} />
    </View>

    {error ? renderErrorText(error) : null}
  </View>
);

const StepButtons = ({
  value = "",
  onSelect = () => {},
  theme = {},
}) =>
  STEP_OPTIONS.map((step) =>
    renderStepButton(step, Number(value) === step, onSelect, theme)
  );

const renderStepButton = (step, active, onSelect, theme) => (
  <TouchableOpacity
    key={step}
    onPress={() => onSelect(step)} // send raw number (correct)
    style={getStepButtonStyle(active, theme)}
  >
    <Text style={getStepButtonTextStyle(active, theme)}>+{step}</Text>
  </TouchableOpacity>
);

const CustomStepInput = ({
  value = "",
  onChange = () => {},
  theme = {},
}) => (
  <TextInput
    keyboardType="number-pad"
    value={value === null || value === undefined ? "" : String(value)}
    onChangeText={onChange} // 🔥 CRITICAL: NO normalization here
    placeholder="Custom"
    style={getInputStyle(theme)}
  />
);

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

const getRowStyle = () => ({
  flexDirection: "row",
  gap: 8,
  alignItems: "center",
});

const getStepButtonStyle = (active, theme = {}) => ({
  flex: 1,
  padding: 10,
  borderRadius: 8,
  backgroundColor: active ? theme.text : theme.card,
  alignItems: "center",
});

const getStepButtonTextStyle = (active, theme = {}) => ({
  color: active ? theme.background : theme.text,
  fontWeight: "bold",
});

const getInputStyle = (theme = {}) => ({
  minWidth: 60,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 8,
  padding: 10,
  color: theme.text,
  backgroundColor: theme.card,
});

const getErrorTextStyle = () => ({
  color: "#FF3B30",
  marginTop: 4,
  fontSize: 12,
  fontWeight: "500",
});
