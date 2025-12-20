import { FaSun, FaMoon } from "react-icons/fa6";

interface ThemeToggleProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="relative w-12 h-4 flex items-center bg-input rounded-full transition-colors focus:outline-none"
    >
      <span
        className={
          "absolute w-6 h-6 bg-surface-alt rounded-full transition-transform duration-300 flex items-center justify-center " +
          (theme === "dark" ? "translate-x-6" : "translate-x-0 shadow")
        }
      >
        {theme === "dark" ? (
          <FaMoon className="text-white" />
        ) : (
          <FaSun className="text-gray-900" />
        )}
      </span>
    </button>
  );
}
