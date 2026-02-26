import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as IntentLauncher from 'expo-intent-launcher';

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
  const mode         = useThemeStore((s) => s.mode);
  const isHydrated   = useThemeStore((s) => s.isHydrated);
  const hydrateTheme = useThemeStore((s) => s.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  useEffect(() => {
    setupNotifications();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationTap
    );
    return () => subscription.remove();
  }, []);

  if (!isHydrated) return null;

  return (
    <AuthProvider>
      <NavigationContainer theme={getNavigationTheme(mode)}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

/* ---------------------------------
   NOTIFICATION SETUP
   Runs once on app start.
   Requests permission then prompts
   user to disable battery optimization
   so Android doesn't kill notifications.
--------------------------------- */

const setupNotifications = async () => {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  if (Platform.OS !== 'android') return;

  Alert.alert(
    '🔔 Enable Reliable Notifications',
    'To receive goal reminders even when the app is in the background, please disable battery optimization for this app.',
    [
      { text: 'Skip', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () =>
          IntentLauncher.startActivityAsync(
            'android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS'
          ),
      },
    ]
  );
};

/* ---------------------------------
   NOTIFICATION TAP HANDLER
   Fires when user taps a notification.
   Extend this to deep-link to Goals screen.
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