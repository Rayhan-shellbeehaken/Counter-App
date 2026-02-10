import { View, TouchableOpacity, Text } from "react-native";
import { TimePeriodEnum } from "@/enums/AnalyticsEnums";
import { getPeriodLabel } from "@/services/analyticsService";

const noop = () => {};

export default function PeriodSelector({
  selected = TimePeriodEnum.SEVEN_DAYS,
  onChange = noop,
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, padding: 16 }}>
      {Object.values(TimePeriodEnum).map((p) => (
        <TouchableOpacity
          key={p}
          onPress={() => onChange(p)}
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: p === selected ? "#000" : "#eee",
          }}
        >
          <Text style={{ color: p === selected ? "#fff" : "#000" }}>
            {getPeriodLabel(p)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
