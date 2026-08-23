import { useEffect, useState } from "react";
import { useAccessibility } from "@features/settings/accessibility";

/**
 * Animates a number from 0 to target over the specified duration.
 * @param target - The target number to animate to.
 * @param duration - Duration of the animation in milliseconds.
 * @returns The animated number value.
 */
export function useAnimatedNumber(target: number, duration = 640) {
  const { animationsEnabled } = useAccessibility();

  const [value, setValue] = useState(0);

  // Reset and animate whenever target changes
  useEffect(() => {
    if (!animationsEnabled) {
      setValue(target);
      return;
    }

    setValue(0);
    let start = 0;

    const frameRate = 16;
    const totalFrames = Math.max(1, Math.floor(duration / frameRate));
    const step = Math.max(1, Math.floor(target / totalFrames));
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
  }, [target, duration, animationsEnabled]);
  return value;
}
