import { useState, useCallback } from "react";
import "../../../styles/animations.css";

export interface FlyTransitionOptions {
  animationsEnabled?: boolean;
  duration?: number;
  direction?: "start" | "end" | "up" | "down";
  initialVisible?: boolean;
}

/**
 * Handles fly-in and fly-out transitions for components.
 * @param animationsEnabled - Whether animations are enabled (default: true).
 * @param duration - Duration of the transition in milliseconds (default: 500ms).
 * @param direction - Direction of the fly transition (default: "start").
 * @param initialVisible - Initial visibility state of the component (default: true).
 * @returns Show/hide state and a trigger function.
 */
export function useFlyTransition({
  animationsEnabled = true,
  duration = 500,
  direction = "start",
  initialVisible = true,
}: FlyTransitionOptions = {}) {
  const [visible, setVisible] = useState(initialVisible);
  const [animating, setAnimating] = useState(false);
  const [flyIn, setFlyIn] = useState(false);

  // Show the component with a fly-in animation
  const show = useCallback(() => {
    setVisible(true);
    setAnimating(false);
    setFlyIn(true);
  }, []);

  // Hide the component with a fly-out animation
  const hide = useCallback(() => {
    if (!animationsEnabled) {
      setVisible(false);
      setAnimating(false);
      return;
    }

    setAnimating(true);
    setFlyIn(false);

    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
    }, duration);
  }, [duration, animationsEnabled]);

  let animationClass = "";

  if (!animationsEnabled) {
    animationClass = visible ? "animate-fade-in" : "animate-fade-out";
  } else if (visible) {
    if (animating) {
      animationClass = `animate-fly-out-${direction}`;
    } else if (flyIn) {
      animationClass = `animate-fly-in-${direction}`;
    } else {
      animationClass = `animate-fly-in-${direction}`;
    }
  }

  return {
    visible,
    animating,
    animationClass,
    show,
    hide,
  };
}
