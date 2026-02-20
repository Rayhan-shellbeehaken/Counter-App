import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ThemeModeEnum } from '@/enums/ThemeEnums';

export const getNavigationTheme = (
  mode = ThemeModeEnum.LIGHT
) => {
  switch (mode) {
    case ThemeModeEnum.DARK:
      return {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: '#000000',
          card: '#050505',         
          text: '#000000',        
          border: '#E5E5E5',
          primary: '#e2e8ee',
        },
      };

    case ThemeModeEnum.LIGHT:
    default:
      return {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#FFFFFF',
          card: '#FFFFFF',
          text: '#000000',
          border: '#E5E5E5',
          primary: '#0b0c0c',
        },
      };
  }
};
