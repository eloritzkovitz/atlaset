import { createContext, useContext } from "react";

export interface AudioContextType {
  play: (name: string) => void;
  stop: (name: string) => void;
  mute: boolean;
  setMute: (mute: boolean) => void;
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  soundEffectsVolume: number;
  setSoundEffectsVolume: (volume: number) => void;
}

export const AudioContext = createContext<AudioContextType>({
  play: () => {},
  stop: () => {},
  mute: false,
  setMute: () => {},
  soundEffectsEnabled: true,
  setSoundEffectsEnabled: () => {},
  soundEffectsVolume: 1.0,
  setSoundEffectsVolume: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}
