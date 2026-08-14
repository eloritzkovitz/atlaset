import { useEffect, useState } from "react";
import { useKeyHandler } from "@hooks";

interface UseDropdownNavigationOptions {
  open: boolean;
  itemCount: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  getItemId: (index: number) => string;
}

/**
 * Manages keyboard navigation for a dropdown menu, including arrow key navigation, selection, and closing the menu.
 */
export function useDropdownNavigation({
  open,
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
    if (!open) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  // Scroll the active option into view when it changes
  useEffect(() => {
    if (!open || activeIndex < 0) return;

    document
      .getElementById(getItemId(activeIndex))
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, getItemId]);

  // Handle keyboard navigation
  useKeyHandler(
    (event) => {
      if (!open || !itemCount) return;

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
    { enabled: open },
  );

  return {
    activeIndex,
    setActiveIndex,
  };
}
