import { useThemeStore } from "@/store/themeStore";
import { ThemeModeEnum } from "@/enums/ThemeEnums";

const defaultTheme = {
  background: "#fff",
  text: "#000",
  card: "#f5f5f5",
};

export const useTheme = () => {
  const mode = useThemeStore((s) => s.mode);

  return getThemeByMode(mode);
};

/* ---------------------------------
   THEME RESOLVER
--------------------------------- */

const getThemeByMode = (mode = ThemeModeEnum.LIGHT) => {
  switch (mode) {
    case ThemeModeEnum.DARK:
      return {
        background: "#0e0d0d",
        text: "#fff",
        card: "#1c1c1e",
      };

    case ThemeModeEnum.LIGHT:
    default:
      return defaultTheme;
  }
};
