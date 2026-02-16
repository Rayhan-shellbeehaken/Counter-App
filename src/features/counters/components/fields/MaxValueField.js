import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";

export default function MaxValueField({ control }) {
  return (
    <Controller
      control={control}
      name="maxValue"
      rules={{
        min: {
          value: 0,
          message: "Max value must be positive",
        },
      }}
      render={({ field }) => (
        <View style={{ marginBottom: 16 }}>
          <Text style={label}>Max Value (optional)</Text>
          <TextInput
            keyboardType="number-pad"
            value={field.value === null ? "" : String(field.value)}
            onChangeText={(t) =>
              field.onChange(t === "" ? null : Number(t))
            }
            style={input}
          />
        </View>
      )}
    />
  );
}

const label = { fontWeight: "bold", marginBottom: 6 };
const input = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 10,
};
