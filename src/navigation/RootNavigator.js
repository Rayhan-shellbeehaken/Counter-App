// src/navigation/RootNavigator.js

import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from '@/navigation/TabNavigator';
import { useThemeStore } from '@/store/themeStore';
import { getNavigationTheme } from '@/theme/navigationTheme';
import { ThemeModeEnum } from '@/enums/ThemeEnums';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  mode: ThemeModeEnum.LIGHT,
};

/* ---------------------------------
   ROOT NAVIGATOR
--------------------------------- */

export default function RootNavigator() {
  const mode =
    useThemeStore((state) => state.mode) ??
    defaultProps.mode;

  return renderNavigationContainer(mode);
}

/* ---------------------------------
   RENDER (NO LOGIC)
--------------------------------- */

const renderNavigationContainer = (
  mode = defaultProps.mode
) => (
  <NavigationContainer theme={getNavigationTheme(mode)}>
    <TabNavigator />
  </NavigationContainer>
);
