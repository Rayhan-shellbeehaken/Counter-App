import { View, Text } from "react-native";

export default function AnalyticsHeader() {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>
        Analytics
      </Text>
      <Text style={{ color: "#888" }}>
        Track your counter progress
      </Text>
    </View>
  );
}
