import React, { useEffect } from "react";

import { useThemeStore } from "@/store/themeStore";
import RootNavigator from "@/navigation/RootNavigator";

const defaultProps = {};

export default function App({} = defaultProps) {
  const isHydrated = useThemeStore((s) => s.isHydrated);
  const hydrateTheme = useThemeStore((s) => s.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  return renderApp({
    isHydrated,
  });
}

const renderApp = ({ isHydrated = false } = {}) => {
  if (!isHydrated) {
    return null;
  }

  return <RootNavigator />;
};
