import type { CSSProperties, JSX } from "react";
import { FaSun, FaMoon } from "react-icons/fa6";
import type { ThemeKey } from "../../types";

interface ThemeConfig {
  isDark: boolean;
  headerStyle: CSSProperties;
  boxClass: string;
  surfaceClass: string;
  textClass: string;
  barClass: string;
  pillClass: string;
}

const THEME_CONFIG: Record<Exclude<ThemeKey, "system">, ThemeConfig> = {
  light: {
    isDark: false,
    headerStyle: {
      background: "var(--preview-light-header, #f1f9ff)",
      borderColor: "#dbe7f7",
    },
    boxClass:
      "h-44 rounded-b-md rounded-t-none bg-white text-gray-700 p-3 shadow-sm",
    surfaceClass: "bg-gray-50",
    textClass: "text-gray-800",
    barClass: "bg-gray-200",
    pillClass: "text-xs text-gray-500 bg-transparent px-2 py-0.5 rounded-full",
  },
  dark: {
    isDark: true,
    headerStyle: { background: "#2b3342", borderColor: "#39424d" },
    boxClass:
      "h-44 rounded-b-md rounded-t-none bg-gray-900 text-gray-200 p-3 shadow-sm",
    surfaceClass: "bg-gray-800",
    textClass: "text-gray-200",
    barClass: "bg-gray-700",
    pillClass: "text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded-full",
  },
};

interface ThemePreviewProps {
  labels: { light: string; dark: string };
  activeTheme?: ThemeKey;
  onSelect?: (theme: ThemeKey) => void;
}

export function ThemePreview({
  labels,
  activeTheme,
  onSelect,
}: ThemePreviewProps) {
  const bars = ["w-1/4", "w-1/4", "w-1/4"];

  const Sample = (cfg: ThemeConfig) => (
    <>
      <div className="flex gap-2 mb-3">
        {bars.map((w, i) => (
          <div key={i} className={`h-2 ${cfg.barClass} rounded-sm ${w}`} />
        ))}
      </div>
      <div
        className={`${cfg.surfaceClass} rounded-md mb-3 overflow-hidden h-10`}
      >
        <div
          className="h-3 rounded-sm mt-3 ml-3 mr-3"
          style={{ width: "60%", background: "var(--color-primary)" }}
        />
      </div>
      <div className={`h-2 ${cfg.barClass} rounded-sm w-5/6`} />
    </>
  );

  const previews: {
    key: ThemeKey;
    label: string;
    icon: JSX.Element;
    cfg: ThemeConfig;
  }[] = [
    {
      key: "light",
      label: labels.light,
      icon: <FaSun />,
      cfg: THEME_CONFIG.light,
    },
    {
      key: "dark",
      label: labels.dark,
      icon: <FaMoon />,
      cfg: THEME_CONFIG.dark,
    },
  ];

  return (
    <div className="w-full mb-2 flex items-start gap-3">
      {previews.map((p) => {
        const active = activeTheme ? p.key === activeTheme : false;
        const cfg = p.cfg;
        const headerStyle = cfg.headerStyle;
        const boxClass = cfg.boxClass;

        return (
          <div
            key={p.key}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            className={`flex-1 cursor-pointer !focus:outline-none rounded-md transition-transform transform ${!active ? "hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-ring-focus" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(p.key);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(p.key);
              }
            }}
          >
            <div className="mb-2">
              <div
                className="flex items-center justify-between rounded-t-md border border-b-0 px-3 py-2"
                style={headerStyle}
              >
                <div
                  className={`inline-flex items-center gap-2 text-sm font-medium ${cfg.textClass}`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </div>
                {active ? (
                  <div className="text-xs font-bold text-blue-600 bg-code px-2 py-0.5 rounded-full">
                    Active
                  </div>
                ) : (
                  <div className={cfg.pillClass} />
                )}
              </div>
            </div>

            <div className={boxClass}>
              <div className="h-full flex flex-col justify-start">
                <div className={cfg.surfaceClass + " rounded-sm mb-3 p-1"} />
                <div className={cfg.isDark ? "brightness-90" : ""}>
                  {Sample(cfg)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
