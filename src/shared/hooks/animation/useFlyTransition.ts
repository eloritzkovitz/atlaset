import { useState, useCallback } from "react";
import "../../styles/animations.css";

export interface FlyTransitionOptions {
  /** Duration in ms */
  duration?: number;
  /** Animation direction: 'left', 'right', 'up', 'down' */
  direction?: "left" | "right" | "up" | "down";
  /** Start visible? */
  initialVisible?: boolean;
}

/**
 * Handles fly-in/fly-out animation state for a component.
 * Returns show/hide state and a trigger function.
 */
export function useFlyTransition({
  duration = 500,
  direction = "left",
  initialVisible = true,
}: FlyTransitionOptions = {}) {
  const [visible, setVisible] = useState(initialVisible);
  const [animating, setAnimating] = useState(false);
  const [flyIn, setFlyIn] = useState(false);

  // Triggers fly-out, then hides after duration
  const trigger = useCallback(() => {
    setAnimating(true);
    setFlyIn(false);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
    }, duration);
  }, [duration]);

  // Triggers fly-in
  const show = useCallback(() => {
    setVisible(true);
    setAnimating(false);
    setFlyIn(true);
  }, []);

  // Animation class based on state
  let animationClass = "";
  if (animating && visible) {
    animationClass = `animate-fly-out-${direction}`;
  } else if (visible && flyIn) {
    animationClass = `animate-fly-in-${direction}`;
  } else if (visible && !animating) {
    animationClass = `animate-fly-in`;
  }

  return {
    visible,
    animating,
    animationClass,
    trigger,
    show,
  };
}
