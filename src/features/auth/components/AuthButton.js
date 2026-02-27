import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/* ---------------------------------
   VARIANTS
   primary → filled blue button
   google  → white/dark card button
   outline → transparent with border
   danger  → red filled button
--------------------------------- */

const VARIANTS = {
  PRIMARY: 'primary',
  GOOGLE:  'google',
  OUTLINE: 'outline',
  DANGER:  'danger',
};

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  label:    '',
  onPress:  () => {},
  loading:  false,
  variant:  VARIANTS.PRIMARY,
  icon:     null,
  disabled: false,
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function AuthButton({
  label    = defaultProps.label,
  onPress  = defaultProps.onPress,
  loading  = defaultProps.loading,
  variant  = defaultProps.variant,
  icon     = defaultProps.icon,
  disabled = defaultProps.disabled,
}) {
  const theme      = useTheme();
  const isDark     = theme.text === '#ffffff';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={getButtonStyle(theme, variant, isDark, isDisabled)}
    >
      {loading
        ? <ActivityIndicator
            color={variant === VARIANTS.PRIMARY || variant === VARIANTS.DANGER
              ? '#fff'
              : theme.primary}
            size="small"
          />
        : (
          <View style={getContentStyle()}>
            {icon && (
              <View style={getIconWrapperStyle()}>
                <Text style={getIconTextStyle()}>{icon}</Text>
              </View>
            )}
            <Text style={getLabelStyle(theme, variant, isDark)}>
              {label}
            </Text>
          </View>
        )
      }
    </TouchableOpacity>
  );
}

/* ---------------------------------
   STYLES
--------------------------------- */

const getButtonStyle = (
  theme      = {},
  variant    = VARIANTS.PRIMARY,
  isDark     = false,
  isDisabled = false,
) => {
  const base = {
    paddingVertical:   15,
    paddingHorizontal: 20,
    borderRadius:      14,
    alignItems:        'center',
    justifyContent:    'center',
    opacity:           isDisabled ? 0.55 : 1,
    shadowOffset:      { width: 0, height: 2 },
    shadowRadius:      6,
    elevation:         3,
  };

  switch (variant) {
    case VARIANTS.PRIMARY:
      return {
        ...base,
        backgroundColor: theme.primary ?? '#007AFF',
        shadowColor:     theme.primary ?? '#007AFF',
        shadowOpacity:   0.35,
      };

    case VARIANTS.GOOGLE:
      return {
        ...base,
        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
        borderWidth:     1,
        borderColor:     isDark
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(0,0,0,0.1)',
        shadowColor:    '#000',
        shadowOpacity:  isDark ? 0.4 : 0.08,
      };

    case VARIANTS.OUTLINE:
      return {
        ...base,
        backgroundColor: 'transparent',
        borderWidth:     1.5,
        borderColor:     theme.primary ?? '#007AFF',
        shadowOpacity:   0,
        elevation:       0,
      };

    case VARIANTS.DANGER:
      return {
        ...base,
        backgroundColor: '#FF3B30',
        shadowColor:     '#FF3B30',
        shadowOpacity:   0.3,
      };

    default:
      return base;
  }
};

const getContentStyle = () => ({
  flexDirection:  'row',
  alignItems:     'center',
  justifyContent: 'center',
  gap:            10,
});

const getIconWrapperStyle = () => ({
  width:          22,
  height:         22,
  alignItems:     'center',
  justifyContent: 'center',
});

const getIconTextStyle = () => ({
  fontSize:   16,
  fontWeight: '700',
});

const getLabelStyle = (
  theme   = {},
  variant = VARIANTS.PRIMARY,
  isDark  = false,
) => {
  const base = {
    fontSize:   16,
    fontWeight: '600',
  };

  switch (variant) {
    case VARIANTS.PRIMARY:
    case VARIANTS.DANGER:
      return { ...base, color: '#ffffff' };

    case VARIANTS.GOOGLE:
      return {
        ...base,
        color:      isDark ? '#ffffff' : '#3c3c3c',
        fontWeight: '500',
      };

    case VARIANTS.OUTLINE:
      return { ...base, color: theme.primary ?? '#007AFF' };

    default:
      return { ...base, color: '#ffffff' };
  }
};