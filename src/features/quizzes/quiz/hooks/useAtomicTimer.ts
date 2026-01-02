import { useEffect, useState, useCallback } from "react";

/**
 * Manages an atomic countdown timer.
 * @param duration - Initial duration in seconds
 * @param active - Whether the timer is active
 * @returns timeLeft and startTimer function
 */
export function useAtomicTimer(duration: number, active: boolean) {
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  // Start or reset timer
  const startTimer = useCallback(() => {
    setStartTimestamp(Date.now());
    setTimeLeft(duration);
  }, [duration]);

  // Update timeLeft every second when active
  useEffect(() => {
    if (!active) return;
    if (!startTimestamp) return;
    setTimeLeft(duration);
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const remaining = Math.max(duration - elapsed, 0);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [duration, active, startTimestamp]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
    setStartTimestamp(Date.now());
  }, [duration]);

  return { timeLeft, startTimer };
}
