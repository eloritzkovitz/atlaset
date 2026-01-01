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

      // Start from hovered item if present, else selected
      const currentKey = hoveredKey || selectedKey;
      let currentIndex = items.findIndex((item) => getKey(item) === currentKey);
      if (currentIndex === -1) currentIndex = 0;

      const scrollTo = (key: string) => {
        setTimeout(() => {
          const el = document.getElementById(key);
          el?.scrollIntoView({ block: "nearest" });
        }, 0);
      };

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        const nextKey = getKey(items[nextIndex]);
        onSelect(nextKey);
        onHover(nextKey);
        scrollTo(nextKey);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        const prevKey = getKey(items[prevIndex]);
        onSelect(prevKey);
        onHover(prevKey);
        scrollTo(prevKey);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = items[currentIndex];
        if (item && onItemInfo) {
          onItemInfo(item);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        const firstKey = getKey(items[0]);
        onSelect(firstKey);
        onHover(firstKey);
        scrollTo(firstKey);
      } else if (e.key === "End") {
        e.preventDefault();
        const lastKey = getKey(items[items.length - 1]);
        onSelect(lastKey);
        onHover(lastKey);
        scrollTo(lastKey);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        const pageSize = 10;
        const nextIndex = Math.min(currentIndex + pageSize, items.length - 1);
        const nextKey = getKey(items[nextIndex]);
        onSelect(nextKey);
        onHover(nextKey);
        scrollTo(nextKey);
      } else if (e.key === "PageUp") {
        e.preventDefault();
        const pageSize = 10;
        const prevIndex = Math.max(currentIndex - pageSize, 0);
        const prevKey = getKey(items[prevIndex]);
        onSelect(prevKey);
        onHover(prevKey);
        scrollTo(prevKey);
      }
    },
    ["ArrowDown", "ArrowUp", "Enter", "Home", "End", "PageDown", "PageUp"],
    enabled
  );
}
