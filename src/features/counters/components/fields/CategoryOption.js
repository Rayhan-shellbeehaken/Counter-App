import { Text, TouchableOpacity } from "react-native";

const noop = () => {};

export default function CategoryOption({
  label = "",
  active = false,
  onPress = noop,
}) {
  return (
    <TouchableOpacity onPress={() => onPress(label)} style={getStyle(active)}>
      <Text style={getTextStyle(active)}>{label}</Text>
    </TouchableOpacity>
  );
}

const getStyle = (active) => ({
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  backgroundColor: active ? "#000" : "#e8e8e8",
});

const getTextStyle = (active) => ({
  color: active ? "#fff" : "#000",
});
