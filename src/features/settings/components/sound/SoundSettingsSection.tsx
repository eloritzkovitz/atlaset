import React, { useEffect, useState } from "react";
import { FaVolumeHigh } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@components";
import { useDebounce } from "@hooks";
import { SettingsCard } from "../SettingsCard";
import { useSoundSettings } from "../../hooks/useSoundSettings";

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
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">{t("sound.title")}</h2>
      <SettingsCard title={t("sound.effects.title")} icon={<FaVolumeHigh />}>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-4 mb-2">
            <Checkbox
              checked={sound.soundEffectsEnabled}
              onChange={handleEnabledChange}
            />
            <label htmlFor="sound-enabled" className="settings-label">
              {t("sound.effects.enable")}
            </label>
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
    </div>
  );
}
