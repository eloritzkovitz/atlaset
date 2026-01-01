import { createContext, useContext } from "react";

export interface AudioContextType {
  play: (name: string) => void;
  stop: (name: string) => void;
  mute: boolean;
  setMute: (mute: boolean) => void;
}

export const AudioContext = createContext<AudioContextType>({
  play: () => {},
  stop: () => {},
  mute: false,
  setMute: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}
