import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const defaultFonts = DefaultTheme.fonts;

export const getNavigationTheme = (mode = 'light') => {
  switch (mode) {
    case 'dark':
      return {
        ...DarkTheme,
        fonts: defaultFonts, // ✅ REQUIRED
        colors: {
          ...DarkTheme.colors,
          background: '#000',
          card: '#111',
          text: '#fff',
          border: '#222',
          primary: '#fff',
        },
      };

    case 'light':
    default:
      return {
        ...DefaultTheme,
        fonts: defaultFonts, // ✅ REQUIRED
        colors: {
          ...DefaultTheme.colors,
          background: '#fff',
          card: '#fff',
          text: '#000',
          border: '#eee',
          primary: '#000',
        },
      };
  }
};
