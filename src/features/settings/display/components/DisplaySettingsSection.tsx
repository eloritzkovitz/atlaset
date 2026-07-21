import { useTranslation } from "react-i18next";
import { FaBrush } from "react-icons/fa6";
import { ColorDot, SectionHeader, Tooltip } from "@components";
import { useTooltipTarget } from "@hooks";
import { ThemePreview } from "./ThemePreview";
import { useTheme } from "../hooks/useTheme";
import { SettingsCard } from "../../common/components/SettingsCard";
import { SettingsToggle } from "../../common/components/SettingsToggle";

export function DisplaySettingsSection() {
  const { theme, preference, setPreference, accent, setAccent } = useTheme();
  const { activeTarget, registerTarget } = useTooltipTarget();
  const { t } = useTranslation("settings");

  const isSystemActive = preference === "system";

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
        <div className="flex flex-col gap-4 w-full">
          <div
            className={`transition-opacity duration-200 ${isSystemActive ? "opacity-60" : "opacity-100"}`}
          >
            <ThemePreview
              labels={{
                light: t("display.theme.light"),
                dark: t("display.theme.dark"),
              }}
              activeTheme={theme}
              onSelect={(k) => setPreference(k)}
            />
          </div>

          <SettingsToggle
            label={t("display.theme.device", "Use device theme")}
            description={
              isSystemActive
                ? t(
                    "display.theme.followingSystem",
                    "Following system preference",
                  )
                : undefined
            }
            checked={isSystemActive}
            onChange={(checked) => setPreference(checked ? "system" : theme)}
          />

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
