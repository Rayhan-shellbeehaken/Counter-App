import React from "react";
import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";

import { useThemeStore } from "@/store/themeStore";
import { ThemeModeEnum } from "@/enums/ThemeEnums";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

const defaultProps = {};

export default function SettingsScreen({} = defaultProps) {
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return renderSettingsScreen({
    theme,
    mode,
    toggleTheme,
    onLogout: handleLogout,
  });
}

const renderSettingsScreen = ({
  theme = {},
  mode = ThemeModeEnum.LIGHT,
  toggleTheme = () => {},
  onLogout = () => {},
}) => (
  <View style={getContainerStyle(theme)}>
    <Text style={getTitleStyle(theme)}>Settings</Text>

    {/* Theme Toggle */}
    <View style={getRowStyle()}>
      <Text style={getLabelStyle(theme)}>Dark Mode</Text>
      <Switch
        value={mode === ThemeModeEnum.DARK}
        onValueChange={toggleTheme}
      />
    </View>

    {/* Logout Button */}
    <TouchableOpacity
      style={getLogoutButtonStyle(theme)}
      onPress={onLogout}
      activeOpacity={0.8}
    >
      <Text style={getLogoutTextStyle()}>Logout</Text>
    </TouchableOpacity>
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

const getLogoutButtonStyle = (theme = {}) => ({
  marginTop: 40,
  backgroundColor: theme.danger ?? "#FF3B30",
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: "center",
 
});

const getLogoutTextStyle = () => ({
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
});