// src/features/counters/components/fields/NameField.js

import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";

const noop = () => {};

export default function NameField({
  control = null, // defensive default
  error = "", // defensive default
}) {
  return (
    <Controller
      control={control}
      name="name"
      rules={{
        required: "Counter name is required",
      
      }}
      render={({ field }) => (
        <View style={container}>
          <Text style={label}>Counter Name</Text>

          <TextInput
            value={field.value ?? ""} // ✅ critical
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

/* ---------- styles ---------- */

const container = { marginBottom: 16 };

const label = {
  fontWeight: "bold",
  marginBottom: 6,
};

const input = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 10,
};

const errorText = {
  color: "red",
  marginTop: 4,
};
