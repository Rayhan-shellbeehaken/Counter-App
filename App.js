import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';
import { getNavigationTheme } from '@/theme/navigationTheme';

import AuthNavigator from '@/navigation/AuthNavigator';
import RootNavigator from '@/navigation/RootNavigator';

/* ---------------------------------
   MAIN APP COMPONENT
--------------------------------- */

export default function App() {
  const mode = useThemeStore((s) => s.mode);
  const isHydrated = useThemeStore((s) => s.isHydrated);
  const hydrateTheme = useThemeStore((s) => s.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  if (!isHydrated) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer theme={getNavigationTheme(mode)}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

/* ---------------------------------
   AUTH-AWARE NAVIGATOR
--------------------------------- */

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <RootNavigator /> : <AuthNavigator />;
}