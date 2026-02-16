// src/store/themeStore.js
import { create } from 'zustand';
import { ThemeModeEnum } from '@/enums/ThemeEnums';

const defaultState = {
  mode: ThemeModeEnum.LIGHT,
};

export const useThemeStore = create((set) => ({
  ...defaultState,

  toggleTheme: () =>
    set((state) => ({
      mode:
        state.mode === ThemeModeEnum.LIGHT
          ? ThemeModeEnum.DARK
          : ThemeModeEnum.LIGHT,
    })),

  setThemeMode: (mode = ThemeModeEnum.LIGHT) =>
    set({
      mode:
        Object.values(ThemeModeEnum).includes(mode)
          ? mode
          : ThemeModeEnum.LIGHT,
    }),
}));
