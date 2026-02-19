import React from "react";
import { View, Text, Switch } from "react-native";

import { useThemeStore } from "@/store/themeStore";
import { ThemeModeEnum } from "@/enums/ThemeEnums";
import { useTheme } from "@/hooks/useTheme";

const defaultProps = {};

export default function SettingsScreen({} = defaultProps) {
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return renderSettingsScreen({
    theme,
    mode,
    toggleTheme,
  });
}

const renderSettingsScreen = ({
  theme = {},
  mode = ThemeModeEnum.LIGHT,
  toggleTheme = () => {},
}) => (
  <View style={getContainerStyle(theme)}>
    <Text style={getTitleStyle(theme)}>Settings</Text>

    <View style={getRowStyle()}>
      <Text style={getLabelStyle(theme)}>Dark Mode</Text>

      <Switch value={mode === ThemeModeEnum.DARK} onValueChange={toggleTheme} />
    </View>
  </View>
);

const getContainerStyle = (theme = {}) => ({
  flex: 1,
  padding: 20,
  backgroundColor: theme.background,
  marginTop: 70,
});

const getTitleStyle = (theme = {}) => ({
  fontSize: 24,
  fontWeight: "bold",
  color: theme.text,
  marginBottom: 20,
});

const getRowStyle = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const getLabelStyle = (theme = {}) => ({
  fontSize: 16,
  color: theme.text,
});
