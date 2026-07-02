import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@components";
import { ICONS } from "@constants/icons";
import { useDebounce } from "@hooks";
import { useSoundSettings } from "../hooks/useSoundSettings";
import { SettingsCard } from "../../common/components/SettingsCard";

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
    <SettingsCard title={t("sound.effects.title")} icon={<ICONS.sound />}>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex w-full items-center justify-between gap-4 mb-2">
          <label htmlFor="sound-enabled" className="settings-label">
            {t("sound.effects.enable")}
          </label>
          <Switch
            checked={sound.soundEffectsEnabled}
            onChange={handleEnabledChange}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label htmlFor="sound-volume" className="settings-label">
            {t("sound.effects.volume")}
          </label>
          <input
            id="sound-volume"
            type="range"
            min={0}
            max={100}
            value={Math.round(localVolume * 100)}
            onChange={handleVolumeChange}
            disabled={!sound.soundEffectsEnabled}
            className="flex-1"
          />
          <span className="settings-value w-10 text-right">
            {Math.round(localVolume * 100)}%
          </span>
        </div>
      </div>
    </SettingsCard>
  );
}
