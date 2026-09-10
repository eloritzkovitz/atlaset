import { useKeyHandler } from "./useKeyHandler";

interface UseArrowNavigationOptions {
  enabled?: boolean;
  isRTL?: boolean;
  wrap?: boolean;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Handles arrow key navigation for previous and next actions, with support for right-to-left layouts.
 */
export function useArrowNavigation({
  enabled = true,
  isRTL = false,
  wrap = false,
  canPrevious,
  canNext,
  onPrevious,
  onNext,
}: UseArrowNavigationOptions): void {
  useKeyHandler(
    (event) => {
      const isPreviousKey = isRTL
        ? event.key === "ArrowRight"
        : event.key === "ArrowLeft";
      const isNextKey = isRTL
        ? event.key === "ArrowLeft"
        : event.key === "ArrowRight";

      if (isPreviousKey && (canPrevious || wrap)) {
        onPrevious();
      } else if (isNextKey && (canNext || wrap)) {
        onNext();
      }
    },
    ["ArrowLeft", "ArrowRight"],
    { enabled },
  );
}
