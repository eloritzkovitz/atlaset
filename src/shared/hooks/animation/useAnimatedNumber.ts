import { useEffect, useState } from "react";

/**
 * Animates a number from 0 to target over the specified duration.
 * @param target - The target number to animate to.
 * @param duration - Duration of the animation in milliseconds.
 * @returns The animated number value.
 */
export function useAnimatedNumber(target: number, duration = 640) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0); // Immediately reset value on target/duration change
    let start = 0;
    // Calculate total frames based on duration and frame rate (16ms)
    const frameRate = 16;
    const totalFrames = Math.max(1, Math.floor(duration / frameRate));
    const step =
      totalFrames > 0 ? Math.max(1, Math.floor(target / totalFrames)) : target;
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(start);
      }
    }, frameRate);
    return () => clearInterval(interval);
  }, [target, duration]);
  return value;
}
