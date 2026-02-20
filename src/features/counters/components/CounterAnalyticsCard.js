import { View, Text } from "react-native";
import AnalyticsChart from "./AnalyticsChart";

export default function CounterAnalyticsCard({
  counter = {},
  stats = {},
  chart = [],
}) {
  return (
    <View style={{ padding: 16, borderRadius: 12, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18 }}>
        {counter.icon} {counter.name}
      </Text>

      <Text>Current: {stats.currentValue}</Text>
      <Text>Total changes: {stats.totalChanges}</Text>

      <AnalyticsChart data={chart} />
    </View>
  );
}
