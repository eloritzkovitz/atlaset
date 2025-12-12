import { useRef, useState } from "react";

/**
 * Manages hover state for floating elements (like menus) that should appear
 * when either the trigger element or the floating element itself is hovered.
 * @param useFloatingHover Whether to enable floating hover behavior
 * @param delay Delay in milliseconds before hiding the floating element after hover out
 * @returns Handlers and state for managing floating hover behavior
 */
export function useFloatingHover(useFloatingHover: boolean, delay = 150) {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing close timeout
  const clearCloseTimeout = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  // Handlers for hover events on the floating element
  const hoverHandlers = useFloatingHover
    ? {
        onMouseEnter: () => {
          clearCloseTimeout();
          setIsHovered(true);
        },
        onMouseLeave: () => {
          closeTimeout.current = setTimeout(() => setIsHovered(false), delay);
        },
      }
    : {};

  // Handlers for hover events on the trigger/button element
  const floatingHandlers = useFloatingHover
    ? {
        onMouseEnter: () => {
          clearCloseTimeout();
          setIsButtonHovered(true);
        },
        onMouseLeave: () => {
          closeTimeout.current = setTimeout(
            () => setIsButtonHovered(false),
            delay
          );
        },
      }
    : {};

  const shouldShowFloating =
    !useFloatingHover || (useFloatingHover && (isHovered || isButtonHovered));

  return { hoverHandlers, floatingHandlers, shouldShowFloating };
}
