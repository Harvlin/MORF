import { useEffect } from "react";
import { useApp } from "@/lib/store";

/** Returns the currently resolved theme and a toggle function. */
export function useTheme() {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);

  /* Apply class to <html> on first mount */
  useEffect(() => {
    setTheme(theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setTheme("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme, setTheme]);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      (typeof window !== "undefined"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : true));

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return { theme, isDark, toggle };
}
