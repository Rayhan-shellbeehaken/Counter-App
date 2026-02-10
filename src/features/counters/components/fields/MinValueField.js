import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";

export default function MinValueField({ control }) {
  return (
    <Controller
      control={control}
      name="minValue"
      render={({ field }) => (
        <View style={{ marginBottom: 16 }}>
          <Text style={label}>Min Value</Text>
          <TextInput
            keyboardType="number-pad"
            value={field.value}
            onChangeText={field.onChange}
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
