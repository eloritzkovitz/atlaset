import { useTranslation } from "react-i18next";
import { FaBrush } from "react-icons/fa6";
import { Checkbox, ColorDot, SectionHeader, Tooltip } from "@components";
import { useTooltipTarget } from "@hooks";
import { ThemePreview } from "./ThemePreview";
import { useTheme } from "../hooks/useTheme";
import { SettingsCard } from "../../common/components/SettingsCard";

export function DisplaySettingsSection() {
  const { theme, preference, setPreference, accent, setAccent } = useTheme();
  const { t } = useTranslation("settings");

  const { activeTarget, registerTarget } = useTooltipTarget();

  const accentColors = [
    "blue",
    "indigo",
    "teal",
    "green",
    "amber",
    "rose",
  ] as const;

  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">
        {t("display.title")}
      </h2>
      <SettingsCard title={t("display.theme.title")} icon={<FaBrush />}>
        <div className="flex flex-col gap-2 w-full">
          <ThemePreview
            labels={{
              light: t("display.theme.light"),
              dark: t("display.theme.dark"),
            }}
            activeTheme={theme}
            onSelect={(k) => setPreference(k)}
          />
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              checked={preference === "system"}
              onChange={(checked) => setPreference(checked ? "system" : theme)}
              label={t("display.theme.device", "Use device theme")}
            />
            {preference === "system" ? (
              <span className="text-xs opacity-70 ms-auto">
                {t(
                  "display.theme.followingSystem",
                  "Follows system preference",
                )}
              </span>
            ) : null}
          </div>
          <SectionHeader title={t("display.accents.label", "Accents")} />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {accentColors.map((a) => (
                <button
                  key={a}
                  aria-pressed={accent === a}
                  aria-label={a}
                  onClick={() => setAccent(a)}
                  {...registerTarget(a)}
                  className="w-10 h-10 rounded-full focus:outline-none"
                >
                  <ColorDot color={`var(--color-accent-${a})`} size={40} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>

      {activeTarget && (
        <Tooltip
          target={activeTarget.element}
          position="top"
          content={
            <span className="capitalize text-sm">{activeTarget.id}</span>
          }
        />
      )}
    </div>
  );
}
