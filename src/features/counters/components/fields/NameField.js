import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";

export default function NameField({ control, error = "" }) {
  return (
    <Controller
      control={control}
      name="name"
      rules={{ required: "Counter name is required" }}
      render={({ field }) => (
        <View style={{ marginBottom: 16 }}>
          <Text style={label}>Counter Name</Text>
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            placeholder="e.g. Water Intake"
            style={input}
          />
          {error ? <Text style={errorText}>{error}</Text> : null}
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
const errorText = { color: "red", marginTop: 4 };
