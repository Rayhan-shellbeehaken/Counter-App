import React from 'react';
import { View, Text } from 'react-native';

/* ---------------------------------
   DEFAULTS
--------------------------------- */

const defaultProps = {
  theme: {},
  streakStats: {
    currentStreak: 0,
    bestStreak: 0,
    totalActiveDays: 0,
  },
};

/* ---------------------------------
   COMPONENT
--------------------------------- */

export default function StreakSection({
  theme = defaultProps.theme,
  streakStats = defaultProps.streakStats,
} = defaultProps) {
  return renderStreakSection({ theme, streakStats });
}

/* ---------------------------------
   RENDER
--------------------------------- */

const renderStreakSection = ({
  theme = {},
  streakStats = {},
} = {}) => (
  <View style={getStreakSectionStyle(theme)}>
    <Text style={getStreakSectionTitleStyle(theme)}>Activity Streak</Text>
    <View style={getStreakRowStyle()}>
      {renderStreakBox({
        theme,
        emoji: '🔥',
        value: streakStats.currentStreak ?? 0,
        label: 'Current',
        isHighlight: true,
      })}
      {renderStreakBox({
        theme,
        emoji: '🏅',
        value: streakStats.bestStreak ?? 0,
        label: 'Best',
        isHighlight: false,
      })}
      {renderStreakBox({
        theme,
        emoji: '📅',
        value: streakStats.totalActiveDays ?? 0,
        label: 'Total Days',
        isHighlight: false,
      })}
    </View>
  </View>
);

const renderStreakBox = ({
  theme = {},
  emoji = '',
  value = 0,
  label = '',
  isHighlight = false,
} = {}) => (
  <View style={getStreakBoxStyle(theme, isHighlight)}>
    <Text style={getStreakEmojiStyle()}>{emoji}</Text>
    <Text style={getStreakNumberStyle(theme, isHighlight)}>
      {value}
    </Text>
    <Text style={getStreakLabelStyle(theme)}>{label}</Text>
  </View>
);

/* ---------------------------------
   STYLES
--------------------------------- */

const getStreakSectionStyle = (theme = {}) => ({
  marginTop: 14,
  padding: 12,
  borderRadius: 12,
  backgroundColor: theme.background ?? 'rgba(0,0,0,0.1)',
});

const getStreakSectionTitleStyle = (theme = {}) => ({
  fontSize: 13,
  fontWeight: '600',
  color: theme.mutedText ?? theme.text,
  marginBottom: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
});

const getStreakRowStyle = () => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const getStreakBoxStyle = (theme = {}, isHighlight = false) => ({
  alignItems: 'center',
  padding: 10,
  borderRadius: 10,
  minWidth: 80,
  backgroundColor: isHighlight
    ? 'rgba(255, 149, 0, 0.15)'
    : 'rgba(128,128,128,0.08)',
  borderWidth: isHighlight ? 1 : 0,
  borderColor: isHighlight ? '#FF9500' : 'transparent',
});

const getStreakEmojiStyle = () => ({
  fontSize: 22,
  marginBottom: 2,
});

const getStreakNumberStyle = (theme = {}, isHighlight = false) => ({
  fontSize: 26,
  fontWeight: 'bold',
  color: isHighlight ? '#FF9500' : theme.text,
});

const getStreakLabelStyle = (theme = {}) => ({
  fontSize: 11,
  color: theme.mutedText ?? theme.text,
  marginTop: 2,
});