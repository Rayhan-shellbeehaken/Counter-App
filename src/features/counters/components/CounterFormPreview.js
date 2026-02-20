import { View, Text } from "react-native";
import { CounterIconEnum } from "@/enums/CounterEnums";

export default function CounterFormPreview({
  icon = CounterIconEnum.GENERIC,
  name = "",
}) {
  return (
    <View
      style={{
        marginVertical: 20,
        padding: 12,
        backgroundColor: "#4cc9f0",
        borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 32 }}>{icon}</Text>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        {name || "Counter Name"}
      </Text>
    </View>
  );
}
