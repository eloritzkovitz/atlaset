import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "@features/settings/accessibility";

/**
 * Animates a flash effect on a value when it changes, indicating an increase or decrease.
 * @param value - The value to watch for changes.
 * @param successClass - Class to apply on increment (default: 'text-success').
 * @param dangerClass - Class to apply on decrement (default: 'text-danger').
 * @returns The current className string.
 */
export function useValueFlash(
  value: number,
  successClass = "text-success",
  dangerClass = "text-danger",
): string {
  const { animationsEnabled } = useAccessibility();
  const [flashAnimation, setFlashAnimation] = useState("");
  const prevValue = useRef(value);

  // Update flash animation when value changes
  useEffect(() => {
    if (!animationsEnabled) {
      return;
    }

    if (value > prevValue.current) {
      setFlashAnimation(successClass);
      setTimeout(() => setFlashAnimation(""), 500);
    } else if (value < prevValue.current) {
      setFlashAnimation(dangerClass);
      setTimeout(() => setFlashAnimation(""), 500);
    }
    prevValue.current = value;
  }, [value, successClass, dangerClass, animationsEnabled]);

  return flashAnimation;
}
