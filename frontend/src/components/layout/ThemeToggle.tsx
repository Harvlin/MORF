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
      className="w-9 h-9 grid place-items-center rounded-xl transition-all"
      style={{
        color: "rgba(242,240,233,0.45)",
        border: "1px solid rgba(242,240,233,0.08)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(242,240,233,0.07)";
        e.currentTarget.style.color = "#F2F0E9";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(242,240,233,0.45)";
      }}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
