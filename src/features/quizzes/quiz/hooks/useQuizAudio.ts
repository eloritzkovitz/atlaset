import { useRef, type RefObject } from "react";

/**
 * Manages quiz audio effects for correct/incorrect answers and game outcomes.
 * @returns Audio playback functions
 */
export function useQuizAudio() {
  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const incorrectAudio = useRef<HTMLAudioElement | null>(null);
  const perfectAudio = useRef<HTMLAudioElement | null>(null);
  const goodAudio = useRef<HTMLAudioElement | null>(null);
  const awwAudio = useRef<HTMLAudioElement | null>(null);
  const loseAudio = useRef<HTMLAudioElement | null>(null);
  const tickingAudio = useRef<HTMLAudioElement | null>(null);

  // Lazy-load audio on first play to avoid browser autoplay restrictions
  const play = (audioRef: RefObject<HTMLAudioElement | null>, src: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };


  // Play normal ticking sound
  const playTick = () => {
    if (!tickingAudio.current) {
      tickingAudio.current = new Audio("/sounds/quiz/tick.mp3");
    }
    tickingAudio.current.currentTime = 0;
    tickingAudio.current.play();
  };

  // Play fast ticking sound for final minute
  const tickX2Audio = useRef<HTMLAudioElement | null>(null);
  const playTickX2 = () => {
    if (!tickX2Audio.current) {
      tickX2Audio.current = new Audio("/sounds/quiz/tick-x2.mp3");
    }
    tickX2Audio.current.currentTime = 0;
    tickX2Audio.current.play();
  };

  const stopTick = () => {
    if (tickingAudio.current) {
      tickingAudio.current.pause();
      tickingAudio.current.currentTime = 0;
    }
    if (tickX2Audio.current) {
      tickX2Audio.current.pause();
      tickX2Audio.current.currentTime = 0;
    }
  };

  return {
    playCorrect: () => play(correctAudio, "/sounds/quiz/correct.mp3"),
    playIncorrect: () => play(incorrectAudio, "/sounds/quiz/incorrect.mp3"),
    playPerfect: () => play(perfectAudio, "/sounds/quiz/perfect.mp3"),
    playGood: () => play(goodAudio, "/sounds/quiz/good.mp3"),
    playAww: () => play(awwAudio, "/sounds/quiz/aww.mp3"),
    playLose: () => play(loseAudio, "/sounds/quiz/lose.mp3"),
    playTick,
    playTickX2,
    stopTick,
  };
}
