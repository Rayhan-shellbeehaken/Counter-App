import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const noop = () => {};

export default function CounterFormFooter({
  onCancel = noop,
  onSubmit = noop,
}) {
  const insets = useSafeAreaInsets();

  return (
<View
  style={[
    styles.container,
    { paddingBottom: 16 + (insets?.bottom ?? 0) },
  ]}
>

      <View style={styles.row}>
        <FooterButton title="Cancel" onPress={onCancel} />
        <FooterButton title="Create Counter" onPress={onSubmit} primary />
      </View>
    </View>
  );
}

function FooterButton({ title = "", onPress = noop, primary = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={getButtonStyle(primary)}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle(primary)}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    padding: 16,
    borderTopWidth: 1,
     paddingBottom: 16,
    borderTopColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    gap: 9,
  },
};

const getButtonStyle = (primary) => ({
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor: primary ? "#000" : "#e8e8e8",
  alignItems: "center",
  marginBottom: 5,
});

const getTextStyle = (primary) => ({
  color: primary ? "#fff" : "#000",
  fontWeight: "bold",
});
