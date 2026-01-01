import React, { useRef, useCallback, useState } from "react";
import { AudioContext } from "./AudioContext";

const soundMap: Record<string, string> = {
  // Atlas sounds
  swoosh: "/sounds/atlas/swoosh.mp3",
  woosh: "/sounds/atlas/woosh.mp3",

  // Quiz sounds
  correct: "/sounds/quiz/correct.mp3",
  incorrect: "/sounds/quiz/incorrect.mp3",
  perfect: "/sounds/quiz/perfect.mp3",
  good: "/sounds/quiz/good.mp3",
  aww: "/sounds/quiz/aww.mp3",
  lose: "/sounds/quiz/lose.mp3",
  tick: "/sounds/quiz/tick.mp3",
  tickX2: "/sounds/quiz/tick-x2.mp3",
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [mute, setMute] = useState(false);

  // Play a sound by name
  const play = useCallback(
    (name: string) => {
      if (mute) return;
      const src = soundMap[name];
      if (!src) return;
      if (!audioRefs.current[name]) {
        audioRefs.current[name] = new Audio(src);
      }
      const audio = audioRefs.current[name];
      audio.currentTime = 0;
      audio.play();
    },
    [mute]
  );

  // Stop a sound by name (pause and reset)
  const stop = useCallback((name: string) => {
    const audio = audioRefs.current[name];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  return (
    <AudioContext.Provider value={{ play, stop, mute, setMute }}>
      {children}
    </AudioContext.Provider>
  );
};
