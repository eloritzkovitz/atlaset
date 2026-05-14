import { FaSun, FaMoon } from "react-icons/fa6";
import { useLanguage } from "../../hooks/useLanguage";
import type { ThemeKey } from "../../types";

interface ThemeToggleProps {
  theme: ThemeKey;
  toggleTheme: () => void;
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const { isRtl } = useLanguage();

  const knobClasses =
    "absolute w-6 h-6 bg-bg rounded-full transition-transform duration-300 flex items-center justify-center ";

  const positionClass = isRtl
    ? theme === "dark"
      ? "translate-x-0"
      : "translate-x-6 shadow"
    : theme === "dark"
      ? "translate-x-6"
      : "translate-x-0 shadow";

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative w-12 h-4 flex items-center bg-surface rounded-full transition-colors focus:outline-none"
    >
      <span className={knobClasses + positionClass}>
        {theme === "dark" ? (
          <FaMoon className="text-white" />
        ) : (
          <FaSun className="text-gray-900" />
        )}
      </span>
    </button>
  );
}
