import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";

import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  control: null,
};

const STEP_OPTIONS = [1, 5, 10];

export default function StepField({ control = defaultProps.control } = {}) {
  const theme = useTheme();

  return renderStepField({
    control,
    theme,
  });
}

const renderStepField = ({ control, theme }) => (
  <Controller
    control={control}
    name="step"
    rules={{
      required: "Step is required",
      min: { value: 1, message: "Step must be at least 1" },
    }}
    render={({ field }) =>
      renderFieldContent({
        value: normalizeStep(field.value),
        onChange: field.onChange,
        theme,
      })
    }
  />
);

const renderFieldContent = ({ value, onChange, theme }) => (
  <View style={getContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Step</Text>

    <View style={getRowStyle()}>
      <StepButtons value={value} onSelect={onChange} theme={theme} />

      <CustomStepInput value={value} onChange={onChange} theme={theme} />
    </View>
  </View>
);

const StepButtons = ({ value = 1, onSelect = () => {}, theme }) =>
  STEP_OPTIONS.map((step) =>
    renderStepButton(step, value === step, onSelect, theme),
  );

const renderStepButton = (step, active, onSelect, theme) => (
  <TouchableOpacity
    key={step}
    onPress={() => onSelect(step)}
    style={getStepButtonStyle(active, theme)}
  >
    <Text style={getStepButtonTextStyle(active, theme)}>+{step}</Text>
  </TouchableOpacity>
);

const CustomStepInput = ({ value, onChange, theme }) => (
  <TextInput
    keyboardType="number-pad"
    value={isPresetStep(value) ? "" : String(value)}
    onChangeText={(text) => onChange(normalizeStep(text))}
    placeholder="Custom"
    style={getInputStyle(theme)}
  />
);

const normalizeStep = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num >= 1 ? num : 1;
};

const isPresetStep = (value) => STEP_OPTIONS.includes(value);

const getContainerStyle = () => ({
  marginBottom: 16,
});

const getLabelStyle = (theme) => ({
  fontWeight: "bold",
  marginBottom: 6,
  color: theme.text,
});

const getRowStyle = () => ({
  flexDirection: "row",
  gap: 8,
  alignItems: "center",
});

const getStepButtonStyle = (active, theme) => ({
  flex: 1,
  padding: 10,
  borderRadius: 8,
  backgroundColor: active ? theme.text : theme.card,
  alignItems: "center",
});

const getStepButtonTextStyle = (active, theme) => ({
  color: active ? theme.background : theme.text,
  fontWeight: "bold",
});

const getInputStyle = (theme) => ({
  minWidth: 60,
  borderWidth: 1,
  borderColor: theme.text,
  borderRadius: 8,
  padding: 10,
  color: theme.text,
});
