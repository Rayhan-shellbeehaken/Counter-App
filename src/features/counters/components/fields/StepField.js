import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";

const noop = () => {};

export default function StepField({ control }) {
  return (
    <Controller
      control={control}
      name="step"
      rules={{
        required: "Step is required",
        min: { value: 1, message: "Step must be at least 1" },
      }}
      render={({ field }) => (
        <View style={{ marginBottom: 16 }}>
          <Text style={label}>Step</Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            {[1, 5, 10].map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => field.onChange(v)}
                style={stepBtn(field.value === v)}
              >
                <Text style={{ color: field.value === v ? "#fff" : "#000" }}>
                  +{v}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              keyboardType="number-pad"
              value={
                [1, 5, 10].includes(field.value)
                  ? ""
                  : String(field.value ?? "")
              }
              onChangeText={(t) =>
                field.onChange(t ? Number(t) : 1)
              }
              style={input}
            />
          </View>
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
const stepBtn = (active) => ({
  flex: 1,
  padding: 10,
  borderRadius: 8,
  backgroundColor: active ? "#000" : "#e8e8e8",
  alignItems: "center",
});
