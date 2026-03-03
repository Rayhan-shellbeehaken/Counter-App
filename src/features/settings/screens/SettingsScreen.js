import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import { useThemeStore } from '@/store/themeStore';
import { ThemeModeEnum } from '@/enums/ThemeEnums';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import ProfileEditor from '@/features/settings/components/ProfileEditor';
import { AuthButton } from '@/features/auth/components';

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function SettingsScreen() {
  const theme       = useTheme();
  const mode        = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const {
    user,
    logout,
    updateProfile,
    removeAccount,
  } = useAuth();

  const [isSaving,   setIsSaving]   = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProfileSave = async ({ displayName, photoURL } = {}) => {
    setIsSaving(true);
    const result = await updateProfile({ displayName, photoURL });
    setIsSaving(false);
    if (result.success) {
      Alert.alert('✅ Saved', 'Your profile has been updated.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text:    'Logout',
          style:   'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await removeAccount();
    setIsDeleting(false);
    // success → AuthContext clears user → AuthNavigator takes over
    if (!result?.success && !result?.cancelled) {
      Alert.alert('Error', result?.error ?? 'Could not delete account.');
    }
  };

  return (
    <ScrollView
      style={getContainerStyle(theme)}
      contentContainerStyle={getContentStyle()}
      showsVerticalScrollIndicator={false}
    >
      <Text style={getTitleStyle(theme)}>Settings</Text>

      {/* Profile */}
      <ProfileEditor
        currentName={user?.displayName ?? ''}
        currentPhoto={user?.photoURL   ?? null}
        onSave={handleProfileSave}
        onCancel={() => setIsSaving(false)}
        isSaving={isSaving}
      />

      {/* Theme Toggle */}
      <View style={getRowStyle(theme)}>
        <Text style={getLabelStyle(theme)}>Dark Mode</Text>
        <Switch
          value={mode === ThemeModeEnum.DARK}
          onValueChange={toggleTheme}
        />
      </View>

      {/* Logout */}
      <AuthButton
        label="Logout"
        onPress={handleLogout}
        variant="danger"
      />

      {/* Delete Account */}
      <AuthButton
        label={isDeleting ? 'Deleting...' : '🗑️  Delete Account'}
        onPress={handleDeleteAccount}
        variant="danger"
        disabled={isDeleting}
        loading={isDeleting}
      />

      <Text style={getDeleteWarningStyle(theme)}>
        Permanently deletes your account and all data.{'\n'}This cannot be undone.
      </Text>
    </ScrollView>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = (theme = {}) => ({
  flex:            1,
  backgroundColor: theme.background,
});

const getContentStyle = () => ({
  padding:    20,
  marginTop:  70,
  gap:        12,
  paddingBottom: 40,
});

const getTitleStyle = (theme = {}) => ({
  fontSize:     24,
  fontWeight:   'bold',
  color:        theme.text,
  marginBottom: 8,
});

const getRowStyle = (theme = {}) => ({
  flexDirection:   'row',
  justifyContent:  'space-between',
  alignItems:      'center',
  backgroundColor: theme.card ?? (theme.text === '#ffffff' ? '#1a1a1a' : '#f5f5f5'),
  padding:         16,
  borderRadius:    12,
  borderWidth:     1,
  borderColor:     theme.border ?? 'rgba(128,128,128,0.15)',
});

const getLabelStyle = (theme = {}) => ({
  fontSize: 16,
  color:    theme.text,
});

const getDeleteWarningStyle = (theme = {}) => ({
  fontSize:   12,
  color:      theme.mutedText ?? '#888',
  textAlign:  'center',
  lineHeight: 18,
  marginTop:  4,
});