import { useTranslation } from "react-i18next";
import { MenuButton, RadioButton } from "@components";
import { ICONS } from "@constants/icons";
import type { ThemeKey } from "@features/settings/display/types";
import { UserSubmenuHeader } from "./UserSubmenuHeader";

interface ThemeSubmenuProps {
  currentTheme: string;
  onThemeSelect: (theme: ThemeKey) => void;
  onBack: () => void;
}

export function ThemeSubmenu({
  currentTheme,
  onThemeSelect,
  onBack,
}: ThemeSubmenuProps) {
  const { t } = useTranslation("common");
  const { t: tSettings } = useTranslation("settings");

  const themeOptions = [
    {
      id: "device" as ThemeKey,
      label: tSettings("display.theme.device"),
      icon: <ICONS.theme.device className="text-lg" />,
    },
    {
      id: "light" as ThemeKey,
      label: tSettings("display.theme.light"),
      icon: <ICONS.theme.light className="text-lg" />,
    },
    {
      id: "dark" as ThemeKey,
      label: tSettings("display.theme.dark"),
      icon: <ICONS.theme.dark className="text-lg" />,
    },
  ];

  return (
    <>
      <UserSubmenuHeader title={t("menu.appearance.title")} onBack={onBack} />

      <div
        className="flex flex-col w-full"
        role="radiogroup"
        aria-label={t("menu.appearance.title")}
      >
        {themeOptions.map((opt) => {
          const isSelected = currentTheme === opt.id;

          return (
            <MenuButton
              key={opt.id}
              onClick={() => onThemeSelect(opt.id)}
              className="w-full flex items-center justify-start gap-3"
            >
              <RadioButton
                name="theme-picker"
                checked={isSelected}
                onChange={() => onThemeSelect(opt.id)}
              />
              <span
                className={`font-semibold transition-colors ${!isSelected ? "text-muted" : ""}`}
              >
                {opt.label}
              </span>
            </MenuButton>
          );
        })}
      </div>
    </>
  );
}
