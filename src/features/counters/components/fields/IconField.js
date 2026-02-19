import { View, Text, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";

import { CounterIconEnum } from "@/enums/CounterEnums";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {
  control: null,
};

const ICONS = Object.values(CounterIconEnum);

export default function IconField({ control = defaultProps.control } = {}) {
  const theme = useTheme();
  return renderIconField({ control, theme });
}

const renderIconField = ({ control, theme }) => (
  <Controller
    control={control}
    name="icon"
    render={({ field }) =>
      renderFieldContent({
        value: field.value,
        onChange: field.onChange,
        theme,
      })
    }
  />
);

const renderFieldContent = ({ value, onChange, theme }) => (
  <View style={getContainerStyle()}>
    <Text style={getLabelStyle(theme)}>Icon</Text>
    <View style={getRowStyle()}>
      {renderIconGrid({
        icons: ICONS,
        selected: value,
        onSelect: onChange,
        theme,
      })}
    </View>
  </View>
);

const renderIconGrid = ({ icons = [], selected = "", onSelect, theme }) =>
  icons.map((icon) =>
    renderIconItem({
      icon,
      isActive: icon === selected,
      onSelect,
      theme,
    }),
  );

const renderIconItem = ({ icon, isActive, onSelect, theme }) => (
  <TouchableOpacity
    key={icon}
    onPress={() => onSelect(icon)}
    style={getIconStyle(isActive, theme)}
  >
    <Text style={getIconTextStyle()}>{icon}</Text>
  </TouchableOpacity>
);

const getContainerStyle = () => ({
  marginBottom: 2,
});

const getLabelStyle = (theme) => ({
  fontWeight: "bold",
  marginBottom: 6,
  color: theme.text,
});

const getRowStyle = () => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
});

const getIconStyle = (active, theme) => ({
  width: "22%",
  aspectRatio: 1,
  borderRadius: 8,
  backgroundColor: active ? theme.text : theme.card,
  justifyContent: "center",
  alignItems: "center",
});

const getIconTextStyle = () => ({
  fontSize: 32,
});
