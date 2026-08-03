import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useDebounce } from "@hooks";
import { formatPercent } from "@utils";
import { useSoundSettings } from "../hooks/useSoundSettings";
import { SettingsCard } from "../../common/components/SettingsCard";
import { SettingsToggle } from "../../common/components/SettingsToggle";

export function SoundSettingsSection() {
  const { t } = useTranslation("settings");
  const [sound, setSound] = useSoundSettings();
  const [localVolume, setLocalVolume] = useState(sound.soundEffectsVolume);
  const debouncedVolume = useDebounce(localVolume, 150);

  // Update global settings when debounced volume changes
  useEffect(() => {
    setSound({ soundEffectsVolume: debouncedVolume });
  }, [debouncedVolume, setSound]);

  // Sync local state with global value
  useEffect(() => {
    setLocalVolume(sound.soundEffectsVolume);
  }, [sound.soundEffectsVolume]);

  // Enabled change handler
  const handleEnabledChange = (checked: boolean) => {
    setSound({ soundEffectsEnabled: checked });
  };

  // Volume change handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVolume(Number(e.target.value) / 100);
  };

  return (
    <SettingsCard
      title={t("account.sound.effects.title")}
      icon={<ICONS.sound />}
    >
      <div className="flex flex-col gap-2 w-full">
        <SettingsToggle
          label={t("account.sound.effects.enable")}
          checked={sound.soundEffectsEnabled}
          onChange={handleEnabledChange}
        />
        <div className="flex items-center gap-4 mt-2">
          <label htmlFor="sound-volume" className="settings-label">
            {t("account.sound.effects.volume")}
          </label>
          <input
            id="sound-volume"
            name="sound-volume"
            type="range"
            min={0}
            max={100}
            value={Math.round(localVolume * 100)}
            onChange={handleVolumeChange}
            disabled={!sound.soundEffectsEnabled}
            className="flex-1"
          />
          <span className="settings-value w-10 text-right">
            {formatPercent(localVolume, 1)}
          </span>
        </div>
      </div>
    </SettingsCard>
  );
}
