// src/navigation/RootNavigator.js

import { useEffect } from 'react';
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

  const isHydrated =
    useThemeStore((state) => state.isHydrated);

  const hydrateTheme =
    useThemeStore((state) => state.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  if (!isHydrated) {
    return null; // or splash loader later
  }

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
