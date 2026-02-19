// src/store/themeStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeModeEnum } from '@/enums/ThemeEnums';

/* ---------------------------------
   CONSTANTS
--------------------------------- */

const THEME_STORAGE_KEY = 'APP_THEME_MODE';

/* ---------------------------------
   DEFAULT STATE
--------------------------------- */

const defaultState = {
  mode: ThemeModeEnum.LIGHT,
  isHydrated: false,
};

/* ---------------------------------
   STORE
--------------------------------- */

export const useThemeStore = create((set, get) => ({
  ...defaultState,

  /* ---------------------------------
     HYDRATION (APP START)
  --------------------------------- */
  hydrateTheme: async () => {
    try {
      const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (storedMode && Object.values(ThemeModeEnum).includes(storedMode)) {
        set({
          mode: storedMode,
          isHydrated: true,
        });
        return;
      }
    } catch (error) {
      // silent fail
    }

    set({ isHydrated: true });
  },

  /* ---------------------------------
     TOGGLE
  --------------------------------- */
  toggleTheme: async () => {
    const currentMode = get().mode;

    const nextMode =
      currentMode === ThemeModeEnum.LIGHT
        ? ThemeModeEnum.DARK
        : ThemeModeEnum.LIGHT;

    set({ mode: nextMode });

    await persistTheme(nextMode);
  },

  /* ---------------------------------
     SET EXPLICIT MODE
  --------------------------------- */
  setThemeMode: async (mode = ThemeModeEnum.LIGHT) => {
    const safeMode = Object.values(ThemeModeEnum).includes(mode)
      ? mode
      : ThemeModeEnum.LIGHT;

    set({ mode: safeMode });

    await persistTheme(safeMode);
  },
}));

/* ---------------------------------
   STORAGE (PURE HELPERS)
--------------------------------- */

const persistTheme = async (mode = ThemeModeEnum.LIGHT) => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    // silent fail
  }
};