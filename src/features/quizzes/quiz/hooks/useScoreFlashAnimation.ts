import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to animate a class when a numeric value changes.
 * @param value The value to watch for changes (e.g., score, streak)
 * @param successClass Class to apply on increment (default: 'text-success')
 * @param dangerClass Class to apply on decrement (default: 'text-danger')
 * @returns The current className string
 */
export function useScoreFlashAnimation(
  value: number,
  successClass = "text-success",
  dangerClass = "text-danger"
): string {
  const [flashAnimation, setFlashAnimation] = useState("");
  const prevValue = useRef(value);

  // Effect to detect changes in value
  useEffect(() => {
    if (value > prevValue.current) {
      setFlashAnimation(successClass);
      setTimeout(() => setFlashAnimation(""), 500);
    } else if (value < prevValue.current) {
      setFlashAnimation(dangerClass);
      setTimeout(() => setFlashAnimation(""), 500);
    }
    prevValue.current = value;
  }, [value, successClass, dangerClass]);

  return flashAnimation;
}
