import { View, Text } from "react-native";
import CounterAnalyticsCard from "./CounterAnalyticsCard";

export default function CounterAnalyticsList({
  data = [],
  empty = false,
}) {
  if (empty) {
    return (
      <View style={{ padding: 32 }}>
        <Text>No counters yet</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12, padding: 16 }}>
      {data.map((item) => (
        <CounterAnalyticsCard
          key={item.counter.id}
          {...item}
        />
      ))}
    </View>
  );
}
