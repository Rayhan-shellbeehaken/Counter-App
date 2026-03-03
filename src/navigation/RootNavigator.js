// src/navigation/RootNavigator.js

import { useEffect } from 'react';

import TabNavigator from '@/navigation/TabNavigator';
import { useThemeStore } from '@/store/themeStore';
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
    return null;
  }

  return renderNavigator();
}

/* ---------------------------------
   RENDER (NO LOGIC)
--------------------------------- */

const renderNavigator = () => {
  return <TabNavigator />;
};