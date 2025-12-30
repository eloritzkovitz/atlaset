import { useMemo } from "react";

/**
 * Determines if the time left should trigger a danger animation.
 * @param timeLeft The time left in seconds
 * @returns true if the animation should be active
 */
export function useTimerFlashAnimation(timeLeft?: number): boolean {
  return useMemo(() => {
    if (typeof timeLeft !== "number") return false;
    const seconds = timeLeft % 60;
    return seconds === 0 || timeLeft <= 60;
  }, [timeLeft]);
}
