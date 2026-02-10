import { View, Text, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import { CounterIconEnum } from "@/enums/CounterEnums";

const ICONS = Object.values(CounterIconEnum);

export default function IconField({ control }) {
  return (
    <Controller
      control={control}
      name="icon"
      render={({ field }) => (
        <View style={{ marginBottom: 16 }}>
          <Text style={label}>Icon</Text>
          <View style={row}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                onPress={() => field.onChange(icon)}
                style={iconStyle(field.value === icon)}
              >
                <Text style={{ fontSize: 32 }}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    />
  );
}

const label = { fontWeight: "bold", marginBottom: 6 };
const row = { flexDirection: "row", flexWrap: "wrap", gap: 8 };
const iconStyle = (active) => ({
  width: "22%",
  aspectRatio: 1,
  borderRadius: 8,
  backgroundColor: active ? "#000" : "#eee",
  justifyContent: "center",
  alignItems: "center",
});
