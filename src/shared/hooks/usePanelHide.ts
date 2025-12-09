import { useEffect } from "react";
import { useKeyHandler } from "@hooks/useKeyHandler";
import { useUI } from "@contexts/UIContext";

interface UsePanelHideOptions {
  show?: boolean;
  onHide?: () => void;
  isModal?: boolean;
  escEnabled?: boolean;
}

export function usePanelHide({
  show = true,
  onHide,
  isModal = false,
  escEnabled = false,
}: UsePanelHideOptions) {
  const { uiVisible, modalOpen } = useUI();

  // Hide on Escape key
  useKeyHandler(
    () => {
      if (!show || !onHide || !escEnabled) return;

      // If this is a modal, always allow closing
      if (isModal) {
        onHide();
      }
      // If this is a panel, only close if no modal is open
      else if (!modalOpen) {
        onHide();
      }
    },
    ["Escape"],
    show && escEnabled
  );

  // Hide when UI is hidden
  useEffect(() => {
    if (!uiVisible && show && onHide) {
      onHide();
    }
  }, [uiVisible, show, onHide]);
}
