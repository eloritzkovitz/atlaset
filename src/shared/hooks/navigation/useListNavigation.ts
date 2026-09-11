import { useKeyHandler } from "../input/useKeyHandler";

interface UseListNavigationProps<T> {
  items: T[];
  getKey: (item: T) => string;
  selectedKey: string | null;
  hoveredKey: string | null;
  onSelect: (key: string | null) => void;
  onHover: (key: string | null) => void;
  onItemInfo?: (item: T) => void;
  enabled?: boolean;
}

/**
 * Enables keyboard navigation for a list of items.
 * @param items - List of items to navigate
 * @param getKey - Function to get unique key for each item
 * @param selectedKey - Currently selected item's key
 * @param hoveredKey - Currently hovered item's key
 * @param onSelect - Callback when an item is selected
 * @param onHover - Callback when an item is hovered
 * @param onItemInfo - Optional callback to get more info about an item
 * @param enabled - Whether navigation is enabled
 */
export function useListNavigation<T>({
  items,
  getKey,
  selectedKey,
  hoveredKey,
  onSelect,
  onHover,
  onItemInfo,
  enabled = true,
}: UseListNavigationProps<T>) {
  useKeyHandler(
    (e) => {
      if (!items.length) return;

      // Find the index of the currently selected or hovered item
      const currentKey = hoveredKey || selectedKey;
      let currentIndex = items.findIndex((item) => getKey(item) === currentKey);

      if (currentIndex === -1) {
        currentIndex = 0;
      }

      // Navigates to the item at the specified index, updates selection and hover state, and scrolls it into view
      const navigateTo = (index: number) => {
        const key = getKey(items[index]);
        onSelect(key);
        onHover(key);
        setTimeout(() => {
          document.getElementById(key)?.scrollIntoView({
            block: "nearest",
          });
        }, 0);
      };

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex =
            currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          navigateTo(nextIndex);
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          const previousIndex =
            currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          navigateTo(previousIndex);
          break;
        }

        case "Enter": {
          e.preventDefault();
          const item = items[currentIndex];
          if (item && onItemInfo) {
            onItemInfo(item);
          }
          break;
        }

        case "Home": {
          e.preventDefault();
          navigateTo(0);
          break;
        }

        case "End": {
          e.preventDefault();
          navigateTo(items.length - 1);
          break;
        }

        case "PageDown": {
          e.preventDefault();
          const pageSize = 10;
          const nextIndex = Math.min(currentIndex + pageSize, items.length - 1);
          navigateTo(nextIndex);
          break;
        }

        case "PageUp": {
          e.preventDefault();
          const pageSize = 10;
          const previousIndex = Math.max(currentIndex - pageSize, 0);
          navigateTo(previousIndex);
          break;
        }

        default:
          break;
      }
    },
    ["ArrowDown", "ArrowUp", "Enter", "Home", "End", "PageDown", "PageUp"],
    { enabled },
  );
}
