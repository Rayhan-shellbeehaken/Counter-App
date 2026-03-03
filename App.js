import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';
import { getNavigationTheme } from '@/theme/navigationTheme';
import { requestNotificationPermission } from '@/services/notificationService';

import AuthNavigator from '@/navigation/AuthNavigator';
import RootNavigator from '@/navigation/RootNavigator';

/* ---------------------------------
   MAIN APP COMPONENT
--------------------------------- */

export default function App() {
  const mode       = useThemeStore((s) => s.mode);
  const isHydrated = useThemeStore((s) => s.isHydrated);
  const hydrateTheme = useThemeStore((s) => s.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  // 🆕 Request notification permissions once on app startup
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // 🆕 Handle notification taps (app opened via notification)
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationTap
    );
    return () => subscription.remove();
  }, []);

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
   NOTIFICATION TAP HANDLER
   Fires when user taps a notification.
   Extend this later to deep-link to the relevant counter/goal.
--------------------------------- */

const handleNotificationTap = (response = {}) => {
  const data = response?.notification?.request?.content?.data ?? {};
  const type = data?.type ?? '';

  console.log('🔔 Notification tapped:', type, data);

  // You can add navigation here later, e.g.:
  // if (type === NotificationTypeEnum.GOAL_COMPLETED) {
  //   navigationRef.navigate('Goals');
  // }
};

/* ---------------------------------
   AUTH-AWARE NAVIGATOR
--------------------------------- */

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? <RootNavigator /> : <AuthNavigator />;
}