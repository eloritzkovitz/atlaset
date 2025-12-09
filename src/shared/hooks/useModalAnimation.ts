import { useState } from "react";

/**
 * Manages modal open/close state with animation support.
 * @param duration - Duration of the close animation in milliseconds (default: 200ms).
 * @returns An object containing modal state and control functions.
 */
export function useModalAnimation(duration = 200) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  // Handles opening the modal
  function openModal() {
    setIsOpen(true);
    setClosing(false);
  }

  // Handles closing the modal with animation
  function closeModal() {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, duration);
  }

  return { isOpen, closing, openModal, closeModal, setIsOpen };
}
