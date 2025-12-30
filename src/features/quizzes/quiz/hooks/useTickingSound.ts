import { useEffect, useRef } from "react";

/**
 * Plays ticking sound when timer is active and time is left.
 * @param timeLeft - Seconds left on the timer
 * @param active - Whether the timer is active
 * @param playTick - Function to play ticking sound
 * @param stopTick - Function to stop ticking sound
 * @param playTickX2 - Optional function to play fast ticking sound
 */
export function useTickingSound(
  timeLeft: number,
  active: boolean,
  playTick: () => void,
  stopTick: () => void,
  playTickX2?: () => void
) {
  const lastTickedSecondRef = useRef<number | null>(null);
  useEffect(() => {
    if (!active || typeof timeLeft !== "number" || timeLeft <= 0) {
      lastTickedSecondRef.current = null;
      stopTick();
      return;
    }
    if (lastTickedSecondRef.current !== timeLeft) {
      if (playTickX2 && timeLeft <= 60) {
        playTickX2();
      } else {
        playTick();
      }
      lastTickedSecondRef.current = timeLeft;
    }
    if (lastTickedSecondRef.current && timeLeft > lastTickedSecondRef.current) {
      lastTickedSecondRef.current = null;
    }
  }, [active, timeLeft, playTick, playTickX2, stopTick]);
}
