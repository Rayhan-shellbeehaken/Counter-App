import React, { useEffect } from "react";

import { useThemeStore } from "@/store/themeStore";
import RootNavigator from "@/navigation/RootNavigator";
import { requestNotificationPermission } from "@/services/notificationService";

const defaultProps = {};

export default function App({} = defaultProps) {
  const isHydrated = useThemeStore((s) => s.isHydrated);
  const hydrateTheme = useThemeStore((s) => s.hydrateTheme);

  useEffect(() => {
    const initApp = async () => {
      // Hydrate theme (existing logic)
      hydrateTheme();

      // 🔴 CRITICAL: Request notification permission on app start
      await requestNotificationPermission();
    };

    initApp();
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