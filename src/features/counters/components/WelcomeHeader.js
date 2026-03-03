import React from 'react';
import { View, Text, Image } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   HELPERS
--------------------------------- */

// Prefer displayName, fall back to email prefix
// "alex@gmail.com" → "Alex"
const getDisplayName = (displayName = null, email = '') => {
  if (displayName && displayName.trim()) {
    return displayName.trim();
  }
  const local = email?.split('@')[0] ?? '';
  if (!local) return 'there';
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
};

const getInitial = (displayName = null, email = '') => {
  if (displayName && displayName.trim()) {
    return displayName.trim().charAt(0).toUpperCase();
  }
  const local = email?.split('@')[0] ?? '';
  return local.charAt(0).toUpperCase() || '?';
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function WelcomeHeader() {
  const { user } = useAuth();
  const theme     = useTheme();

  const name    = getDisplayName(user?.displayName, user?.email ?? '');
  const initial = getInitial(user?.displayName, user?.email ?? '');
  const photoURL = user?.photoURL ?? null;

  return renderWelcomeHeader({ theme, name, photoURL, initial });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderWelcomeHeader = ({
  theme    = {},
  name     = '',
  photoURL = null,
  initial  = '?',
} = {}) => (
  <View style={getContainerStyle()}>
    <View style={getTextBlockStyle()}>
      <Text style={getGreetingStyle(theme)}>Welcome back,</Text>
      <Text style={getNameStyle(theme)}>Hello, {name}! 👋</Text>
    </View>

    {renderAvatar({ theme, photoURL, initial })}
  </View>
);

const renderAvatar = ({ theme = {}, photoURL = null, initial = '?' } = {}) => {
  if (photoURL) {
    return <Image source={{ uri: photoURL }} style={getAvatarStyle()} />;
  }

  return (
    <View style={getAvatarFallbackStyle(theme)}>
      <Text style={getAvatarInitialStyle(theme)}>{initial}</Text>
    </View>
  );
};

/* ---------------------------------
   STYLES
--------------------------------- */

const getContainerStyle = () => ({
  flexDirection:     'row',
  justifyContent:    'space-between',
  alignItems:        'center',
  paddingHorizontal: 16,
  paddingVertical:   12,
  marginBottom:      4,
});

const getTextBlockStyle = () => ({
  flex: 1,
});

const getGreetingStyle = (theme = {}) => ({
  fontSize:   13,
  color:      theme.mutedText ?? '#888',
  fontWeight: '500',
});

const getNameStyle = (theme = {}) => ({
  fontSize:   22,
  fontWeight: '700',
  color:      theme.text,
  marginTop:  2,
});

const getAvatarStyle = () => ({
  width:        44,
  height:       44,
  borderRadius: 22,
  marginLeft:   12,
});

const getAvatarFallbackStyle = (theme = {}) => ({
  width:           44,
  height:          44,
  borderRadius:    22,
  marginLeft:      12,
  backgroundColor: theme.primary ?? '#007AFF',
  alignItems:      'center',
  justifyContent:  'center',
});

const getAvatarInitialStyle = (theme = {}) => ({
  color:      theme.onPrimary ?? '#fff',
  fontSize:   18,
  fontWeight: '700',
});