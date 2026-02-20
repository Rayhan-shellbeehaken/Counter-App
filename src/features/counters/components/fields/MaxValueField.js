// src/features/counters/components/fields/MaxValueField.js

import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";

import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  control: null,
};

export default function MaxValueField({ control = defaultProps.control } = {}) {
  const theme = useTheme();

  return renderMaxValueField({
    control,
    theme,
  });
}

const renderMaxValueField = ({ control, theme }) => (
  <Controller
    control={control}
    name="maxValue"
    rules={getValidationRules()}
    render={({ field }) =>
      renderFieldContent({
        value: field.value,
        onChange: field.onChange,
        theme,
      })
    }
  />
);

const renderFieldContent = ({ value, onChange, theme }) => (
  <View style={getContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Max Value (optional)</Text>

    <TextInput
      keyboardType="number-pad"
      value={getDisplayValue(value)}
      onChangeText={(text) => handleValueChange(text, onChange)}
      style={getInputStyle(theme)}
    />
  </View>
);

const getValidationRules = () => ({
  min: {
    value: 0,
    message: "Max value must be positive",
  },
});

const getDisplayValue = (value) =>
  value === null || value === undefined ? "" : String(value);

const handleValueChange = (text = "", onChange = () => {}) => {
  if (text === "") {
    onChange(null);
    return;
  }

  const numericValue = Number(text);
  onChange(Number.isNaN(numericValue) ? null : numericValue);
};

const getContainerStyle = () => ({
  marginBottom: 50,
});

const getLabelStyle = (theme) => ({
  fontWeight: "bold",
  marginBottom: 6,
  color: theme.text,
});

const getInputStyle = (theme) => ({
  borderWidth: 1,
  borderColor: theme.card,
  backgroundColor: theme.background,
  color: theme.text,
  borderRadius: 8,
  padding: 10,
  borderColor: theme.text,
});
