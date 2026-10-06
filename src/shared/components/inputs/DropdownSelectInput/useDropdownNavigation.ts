import { useEffect, useState } from "react";
import { useKeyHandler } from "@hooks";
import type { OverlayProps, TriggerProps } from "../../overlay/types";

interface UseDropdownNavigationOptions extends OverlayProps, TriggerProps {
  itemCount: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  getItemId: (index: number) => string;
}

/**
 * Manages keyboard navigation for a dropdown menu, including arrow key navigation, selection, and closing the menu.
 */
export function useDropdownNavigation({
  isOpen,
  itemCount,
  selectedIndex,
  onSelect,
  onClose,
  triggerRef,
  getItemId,
}: UseDropdownNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Set the active index to the selected option when the dropdown opens
  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [isOpen, selectedIndex]);

  // Scroll the active option into view when it changes
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;

    document
      .getElementById(getItemId(activeIndex))
      ?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex, getItemId]);

  // Handle keyboard navigation
  useKeyHandler(
    (event) => {
      if (!isOpen || !itemCount) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((current) =>
            current < itemCount - 1 ? current + 1 : 0,
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((current) =>
            current > 0 ? current - 1 : itemCount - 1,
          );
          break;

        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;

        case "End":
          event.preventDefault();
          setActiveIndex(itemCount - 1);
          break;

        case "Enter":
          event.preventDefault();
          if (activeIndex >= 0) onSelect(activeIndex);
          break;

        case "Escape":
          event.preventDefault();
          onClose();
          triggerRef.current?.focus();
          break;
      }
    },
    ["ArrowDown", "ArrowUp", "Home", "End", "Enter", "Escape"],
    { enabled: isOpen },
  );

  return {
    activeIndex,
    setActiveIndex,
  };
}
