import { FaVolumeUp } from "react-icons/fa";
import { useSoundSettings } from "@features/settings/hooks/useSoundSettings";
import { SettingsCard } from "../SettingsCard";
import { Checkbox } from "@components";

export function SoundSettingsSection() {
  const [sound, setSound] = useSoundSettings();

  // Handlers for changes
  const handleEnabledChange = (checked: boolean) => {
    setSound({ soundEffectsEnabled: checked });
  };

  // Volume change handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSound({ soundEffectsVolume: Number(e.target.value) / 100 });
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
              value={Math.round(sound.soundEffectsVolume * 100)}
              onChange={handleVolumeChange}
              disabled={!sound.soundEffectsEnabled}
              className="flex-1"
            />
            <span className="settings-value w-10 text-right">
              {Math.round(sound.soundEffectsVolume * 100)}%
            </span>
          </div>
          <div className="mt-2 text-xs text-muted">
            Sound effects are{" "}
            {sound.soundEffectsEnabled ? "enabled" : "disabled"} at{" "}
            {Math.round(sound.soundEffectsVolume * 100)}% volume.
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
