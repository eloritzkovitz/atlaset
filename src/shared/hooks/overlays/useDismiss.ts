import { useEffect, useRef } from "react";
import { useUI } from "@contexts/UIContext";
import { useKeyHandler } from "../input/useKeyHandler";

interface UseDismissOptions {
  show?: boolean;
  onHide?: () => void;
  isModal?: boolean;
  escEnabled?: boolean;
}

/**
 * Automatically dismisses an overlay when the Escape key is pressed or when the global UI becomes hidden.
 */
export function useDismiss({
  show = true,
  onHide,
  isModal = false,
  escEnabled = false,
}: UseDismissOptions) {
  const { uiVisible, modalOpen } = useUI();

  // Keep ref to latest onHide to avoid stale closures without breaking effect dependencies
  const onHideRef = useRef(onHide);
  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  // Handle Escape Key
  useKeyHandler(
    () => {
      if (!onHideRef.current) return;

      // Close modals always; close panels only if no modal is active over them
      if (isModal || !modalOpen) {
        onHideRef.current();
      }
    },
    ["Escape"],
    { enabled: show && escEnabled },
  );

  // Close when global UI becomes hidden
  useEffect(() => {
    if (!uiVisible && show) {
      onHideRef.current?.();
    }
  }, [uiVisible, show]);
}
