import { useEffect, useRef } from "react";
import { useAudio } from "@contexts/AudioContext";

/**
 * Plays ticking sound when timer is active and time is left.
 * @param timeLeft - Seconds left on the timer
 * @param active - Whether the timer is active
 * Uses global audio context to play ticking sounds
 */
export function useTickingSound(timeLeft: number, active: boolean) {
  const { play, stop } = useAudio();
  const lastTickedSecondRef = useRef<number | null>(null);
  useEffect(() => {
    if (!active || typeof timeLeft !== "number" || timeLeft <= 0) {
      lastTickedSecondRef.current = null;
      stop("tick");
      stop("tickX2");
      return;
    }
    if (lastTickedSecondRef.current !== timeLeft) {
      if (timeLeft <= 60) {
        play("tickX2");
      } else {
        play("tick");
      }
      lastTickedSecondRef.current = timeLeft;
    }
    if (lastTickedSecondRef.current && timeLeft > lastTickedSecondRef.current) {
      lastTickedSecondRef.current = null;
    }
  }, [active, timeLeft, play, stop]);
}
