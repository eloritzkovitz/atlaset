import { useRef, type RefObject } from "react";

/**
 * Manages quiz audio effects for correct/incorrect answers and game outcomes.
 * @returns Audio playback functions
 */
export function useQuizAudio() {
  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const incorrectAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);
  const loseAudio = useRef<HTMLAudioElement | null>(null);

  // Lazy-load audio on first play to avoid browser autoplay restrictions
  const play = (audioRef: RefObject<HTMLAudioElement | null>, src: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return {
    playCorrect: () => play(correctAudio, "/sounds/quiz/correct.mp3"),
    playIncorrect: () => play(incorrectAudio, "/sounds/quiz/incorrect.mp3"),
    playWin: () => play(winAudio, "/sounds/quiz/win.mp3"),
    playLose: () => play(loseAudio, "/sounds/quiz/lose.mp3"),
  };
}
