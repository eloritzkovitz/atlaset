import React from "react";
import { FaVolumeUp } from "react-icons/fa";
import { Checkbox } from "@components";
import { useDebounce } from "@hooks";
import { SettingsCard } from "../SettingsCard";
import { useSoundSettings } from "../../hooks/useSoundSettings";

export function SoundSettingsSection() {
  const [sound, setSound] = useSoundSettings();
  const [localVolume, setLocalVolume] = React.useState(
    sound.soundEffectsVolume
  );
  const debouncedVolume = useDebounce(localVolume, 150);

  // Update global settings when debounced volume changes
  React.useEffect(() => {
    setSound({ soundEffectsVolume: debouncedVolume });
  }, [debouncedVolume, setSound]);

  // Sync local state with global value
  React.useEffect(() => {
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
    <div className="mx-auto max-w-lg w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">Sound Settings</h2>
      <SettingsCard title="Sound Effects" icon={<FaVolumeUp />}>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-4 mb-2">
            <Checkbox
              checked={sound.soundEffectsEnabled}
              onChange={handleEnabledChange}
            />
            <label htmlFor="sound-enabled" className="settings-label">
              Enable Sound Effects
            </label>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label htmlFor="sound-volume" className="settings-label">
              Volume
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
