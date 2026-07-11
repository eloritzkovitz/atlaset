import { useMemo } from "react";

interface UsePanelAnimationOptions {
  show: boolean;
  isMobile: boolean;
  isRtl: boolean;
  animationsEnabled: boolean;
  position: "left" | "right";
}

/**
 * Manages panel open/close state with animation support.
 * @param show - Whether the panel is currently shown.
 * @param isMobile - Whether the current screen size is mobile.
 * @param isRtl - Whether the current language direction is right-to-left.
 * @param animationsEnabled - Whether animations are enabled in accessibility settings.
 * @param position - The position of the panel ("left" or "right").
 * @returns A string of CSS classes to apply for the panel's animation and visibility.
 */
export function usePanelAnimation({
  show,
  isMobile,
  isRtl,
  animationsEnabled,
  position,
}: UsePanelAnimationOptions) {
  return useMemo(() => {
    // Determine the appropriate transition classes based on accessibility settings
    const transitionClass = animationsEnabled
      ? "transition-all duration-300 ease-in-out"
      : "transition-none";
    const gpuClass = animationsEnabled ? "will-change-transform" : "";

    // Handle mobile view
    if (isMobile) {
      const visibilityClass = show
        ? "translate-y-0 opacity-100"
        : `${animationsEnabled ? "translate-y-full" : ""} opacity-0 pointer-events-none`;

      return `fixed bottom-0 start-0 end-0 z-50 bg-surface flex flex-col rounded-t-2xl shadow-lg ${transitionClass} ${visibilityClass}`;
    }

    // Handle desktop view
    const positionClass = position === "right" ? "end-0" : "start-16";

    let translateOffset = "";
    if (!show && animationsEnabled) {
      if (position !== "right") {
        translateOffset = isRtl ? "translate-x-full" : "-translate-x-full";
      } else {
        translateOffset = isRtl ? "-translate-x-full" : "translate-x-full";
      }
    }

    // Determine the appropriate visibility class based on show state and accessibility settings
    const visibilityClass = show
      ? "translate-x-0 opacity-100"
      : `${translateOffset} opacity-0 pointer-events-none`;

    return `fixed bg-surface flex flex-col h-screen top-0 ${positionClass} z-40 ${gpuClass} ${transitionClass} focus:outline-none shadow ${visibilityClass}`;
  }, [show, isMobile, isRtl, animationsEnabled, position]);
}
