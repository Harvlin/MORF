import { Sun, Moon } from "lucide-react";
import { useApp } from "@/lib/store";
import { useEffect } from "react";

export function ThemeToggle() {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);

  useEffect(() => {
    setTheme(theme);
  }, []); // eslint-disable-line

  const isDark =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 grid place-items-center rounded-lg hover:bg-surface-3 text-text-2 hover:text-text-1 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
