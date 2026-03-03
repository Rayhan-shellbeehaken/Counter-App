import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  currentName:  '',
  currentPhoto: null,
  onSave:       () => {},
  onCancel:     () => {},
  isSaving:     false,
};

/* ---------------------------------
   HELPERS
   Detect dark mode by text color —
   more reliable than checking background.
   Dark theme has white text (#ffffff).
--------------------------------- */

const isDarkMode = (theme = {}) =>
  theme.text === '#ffffff' || theme.text === '#fff';

// Card surface — slightly lighter than background in dark, white in light
const getCardBackground = (theme = {}, dark = false) =>
  dark ? '#1a1a1a' : '#ffffff';

// Secondary surface for inputs and cancel button
const getSubtleBackground = (dark = false) =>
  dark ? '#2a2a2a' : '#f2f2f7';

// Muted text color
const getMutedColor = (dark = false) =>
  dark ? '#666666' : '#999999';

// Divider color
const getDividerColor = (dark = false) =>
  dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function ProfileEditor({
  currentName  = defaultProps.currentName,
  currentPhoto = defaultProps.currentPhoto,
  onSave       = defaultProps.onSave,
  onCancel     = defaultProps.onCancel,
  isSaving     = defaultProps.isSaving,
}) {
  const theme = useTheme();
  const dark  = isDarkMode(theme);

  const [name,         setName]         = useState(currentName);
  const [photoURI,     setPhotoURI]     = useState(currentPhoto);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [isEditing,    setIsEditing]    = useState(false);

  const hasChanges = name.trim() !== currentName || photoChanged;

  const handleStartEditing = () => setIsEditing(true);

  const handleCancel = () => {
    setName(currentName);
    setPhotoURI(currentPhoto);
    setPhotoChanged(false);
    setIsEditing(false);
    onCancel();
  };

  const handlePickPhoto = async () => {
    try {
      const { status: currentStatus } =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      let finalStatus = currentStatus;

      if (currentStatus !== 'granted') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please go to Settings → Apps → [this app] → Permissions → Photos and allow access.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:    ['images'],
        allowsEditing: true,
        aspect:        [1, 1],
        quality:       0.4,
        base64:        true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];

      if (!asset?.base64) {
        Alert.alert('Error', 'Could not process the image. Please try a different photo.');
        return;
      }

      setPhotoURI(`data:image/jpeg;base64,${asset.base64}`);
      setPhotoChanged(true);
    } catch (error) {
      console.error('📷 Image picker error:', error);
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    }
  };

  const handleSave = () => {
    onSave({
      displayName: name.trim() || null,
      photoURL:    photoChanged ? photoURI : null,
    });
    setIsEditing(false);
    setPhotoChanged(false);
  };

  return renderProfileEditor({
    theme,
    dark,
    name,
    photoURI,
    isSaving,
    hasChanges,
    isEditing,
    onStartEditing: handleStartEditing,
    onPickPhoto:    handlePickPhoto,
    onChangeName:   setName,
    onSave:         handleSave,
    onCancel:       handleCancel,
  });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderProfileEditor = ({
  theme          = {},
  dark           = false,
  name           = '',
  photoURI       = null,
  isSaving       = false,
  hasChanges     = false,
  isEditing      = false,
  onStartEditing = () => {},
  onPickPhoto    = () => {},
  onChangeName   = () => {},
  onSave         = () => {},
  onCancel       = () => {},
}) => (
  <View style={getCardStyle(theme, dark)}>

    {/* Primary color accent strip */}
    <View style={getBannerStyle(theme)} />

    {/* Avatar + Name side by side */}
    <View style={getProfileRowStyle()}>

      <TouchableOpacity
        onPress={isEditing ? onPickPhoto : undefined}
        activeOpacity={isEditing ? 0.75 : 1}
        style={getAvatarTouchStyle()}
      >
        {photoURI
          ? <Image source={{ uri: photoURI }} style={getAvatarImageStyle(theme)} />
          : <View style={getAvatarFallbackStyle(theme)}>
              <Text style={getAvatarInitialStyle()}>
                {name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
        }
        {isEditing && (
          <View style={getCameraOverlayStyle()}>
            <Text style={getCameraIconStyle()}>📷</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={getNameBlockStyle()}>
        <Text style={getNameStyle(theme)} numberOfLines={1}>
          {name || 'No name set'}
        </Text>
        <Text style={getHintStyle(dark)}>
          {isEditing ? 'Tap photo to change' : 'Tap Edit to update profile'}
        </Text>
      </View>

    </View>

    {/* Divider */}
    <View style={getDividerStyle(dark)} />

    {/* Name input — edit mode only */}
    {isEditing && (
      <View style={getInputWrapperStyle()}>
        <Text style={getInputLabelStyle(dark)}>DISPLAY NAME</Text>
        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="Enter your name"
          placeholderTextColor={getMutedColor(dark)}
          style={getInputStyle(theme, dark)}
          autoCapitalize="words"
          autoFocus
        />
      </View>
    )}

    {/* Buttons */}
    {!isEditing
      ? (
        <TouchableOpacity
          onPress={onStartEditing}
          style={getEditButtonStyle(theme, dark)}
          activeOpacity={0.8}
        >
          <Text style={getEditButtonTextStyle(theme)}>✎   Edit Profile</Text>
        </TouchableOpacity>
      )
      : (
        <View style={getButtonRowStyle()}>
          <TouchableOpacity
            onPress={onCancel}
            style={getCancelButtonStyle(dark)}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            <Text style={getCancelTextStyle(theme)}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSave}
            disabled={!hasChanges || isSaving}
            style={getSaveButtonStyle(theme, hasChanges && !isSaving)}
            activeOpacity={0.8}
          >
            {isSaving
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={getSaveTextStyle()}>Save Changes</Text>
            }
          </TouchableOpacity>
        </View>
      )
    }

  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getCardStyle = (theme = {}, dark = false) => ({
  borderRadius:    20,
  marginBottom:    20,
  overflow:        'hidden',
  backgroundColor: getCardBackground(theme, dark),
  shadowColor:     '#000',
  shadowOffset:    { width: 0, height: 4 },
  shadowOpacity:   dark ? 0.5 : 0.08,
  shadowRadius:    12,
  elevation:       6,
  // Subtle border so card is visible against dark background
  borderWidth:     dark ? 1 : 0,
  borderColor:     dark ? 'rgba(255,255,255,0.08)' : 'transparent',
});

const getBannerStyle = (theme = {}) => ({
  height:          5,
  backgroundColor: theme.primary ?? '#007AFF',
});

const getProfileRowStyle = () => ({
  flexDirection:     'row',
  alignItems:        'center',
  paddingHorizontal: 20,
  paddingTop:        20,
  paddingBottom:     16,
  gap:               16,
});

const getAvatarTouchStyle = () => ({
  position: 'relative',
});

const getAvatarImageStyle = (theme = {}) => ({
  width:        76,
  height:       76,
  borderRadius: 38,
  borderWidth:  3,
  borderColor:  theme.primary ?? '#007AFF',
});

const getAvatarFallbackStyle = (theme = {}) => ({
  width:           76,
  height:          76,
  borderRadius:    38,
  backgroundColor: theme.primary ?? '#007AFF',
  alignItems:      'center',
  justifyContent:  'center',
  borderWidth:     3,
  borderColor:     theme.primary ?? '#007AFF',
});

const getAvatarInitialStyle = () => ({
  fontSize:   30,
  fontWeight: '800',
  color:      '#ffffff',
});

const getCameraOverlayStyle = () => ({
  position:        'absolute',
  top:             0,
  left:            0,
  right:           0,
  bottom:          0,
  borderRadius:    38,
  backgroundColor: 'rgba(0,0,0,0.45)',
  alignItems:      'center',
  justifyContent:  'center',
});

const getCameraIconStyle = () => ({
  fontSize: 22,
});

const getNameBlockStyle = () => ({
  flex: 1,
});

const getNameStyle = (theme = {}) => ({
  fontSize:     18,
  fontWeight:   '700',
  color:        theme.text,
  marginBottom: 4,
});

const getHintStyle = (dark = false) => ({
  fontSize: 12,
  color:    getMutedColor(dark),
});

const getDividerStyle = (dark = false) => ({
  height:           1,
  marginHorizontal: 20,
  backgroundColor:  getDividerColor(dark),
  marginBottom:     16,
});

const getInputWrapperStyle = () => ({
  paddingHorizontal: 20,
  marginBottom:      4,
});

const getInputLabelStyle = (dark = false) => ({
  fontSize:      10,
  fontWeight:    '700',
  letterSpacing: 1.2,
  color:         getMutedColor(dark),
  marginBottom:  6,
});

const getInputStyle = (theme = {}, dark = false) => ({
  backgroundColor: getSubtleBackground(dark),
  borderRadius:    12,
  padding:         14,
  fontSize:        15,
  fontWeight:      '500',
  color:           theme.text,
  marginBottom:    16,
});

const getEditButtonStyle = (theme = {}, dark = false) => ({
  marginHorizontal:  20,
  marginBottom:      18,
  paddingVertical:   13,
  borderRadius:      14,
  alignItems:        'center',
  backgroundColor:   dark
    ? 'rgba(10,132,255,0.12)'
    : 'rgba(0,122,255,0.08)',
  borderWidth:       1,
  borderColor:       dark
    ? 'rgba(10,132,255,0.3)'
    : 'rgba(0,122,255,0.2)',
});

const getEditButtonTextStyle = (theme = {}) => ({
  color:      theme.primary ?? '#007AFF',
  fontWeight: '600',
  fontSize:   15,
});

const getButtonRowStyle = () => ({
  flexDirection:     'row',
  paddingHorizontal: 20,
  paddingBottom:     18,
  gap:               10,
});

const getCancelButtonStyle = (dark = false) => ({
  flex:            1,
  paddingVertical: 13,
  borderRadius:    14,
  alignItems:      'center',
  backgroundColor: getSubtleBackground(dark),
});

const getCancelTextStyle = (theme = {}) => ({
  color:      theme.text,
  fontWeight: '600',
  fontSize:   15,
});

const getSaveButtonStyle = (theme = {}, enabled = false) => ({
  flex:            1,
  paddingVertical: 13,
  borderRadius:    14,
  alignItems:      'center',
  backgroundColor: enabled
    ? (theme.primary ?? '#007AFF')
    : 'rgba(128,128,128,0.3)',
});

const getSaveTextStyle = () => ({
  color:      '#fff',
  fontWeight: '700',
  fontSize:   15,
});