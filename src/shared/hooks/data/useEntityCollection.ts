import { useEffect, useRef, useState } from "react";

/** Represents an entity in the collection. */
export interface Entity {
  id: string;
  order?: number;
  visible?: boolean;
}

/** Options for configuring the entity collection hook. */
export interface UseEntityCollectionOptions<T extends Entity> {
  initialItems: T[];
  persistItems: (items: T[]) => Promise<void>;
  onLogAction?: (
    action: "add" | "edit" | "remove" | "reorder",
    item: T,
  ) => Promise<void>;
}

/**
 * Manages a collection of entities with basic operations.
 * @template T - The type of entity in the collection, extending the Entity interface.
 * @param initialItems - The initial collection of entities.
 * @param persistItems - A function to persist changes to the collection.
 * @param onLogAction - An optional function to log actions performed on the collection.
 * @returns An object containing the current items and methods to manipulate the collection.
 */
export function useEntityCollection<T extends Entity>({
  initialItems,
  persistItems,
  onLogAction,
}: UseEntityCollectionOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const itemsRef = useRef<T[]>(items);

  itemsRef.current = items;

  const initialKeys = initialItems.map((i) => i.id).join(",");
  const prevKeysRef = useRef(initialKeys);

  // Sync with initialItems prop changes
  useEffect(() => {
    if (initialKeys !== prevKeysRef.current) {
      prevKeysRef.current = initialKeys;
      if (initialItems.length > 0) {
        setItems(initialItems);
      }
    }
  }, [initialKeys, initialItems]);

  /** Applies state update and triggers persistence. */
  const applyChange = async (nextItems: T[]) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
    await persistItems(nextItems);
  };

  /** Adds a new item. */
  async function addItem(newItem: T) {
    const currentItems = itemsRef.current;
    const itemWithOrder = {
      ...newItem,
      order: newItem.order ?? currentItems.length,
    };

    const nextItems = [...currentItems, itemWithOrder];

    if (onLogAction) await onLogAction("add", itemWithOrder);
    await applyChange(nextItems);
  }

  /** Edits an existing item. */
  async function updateItem(updatedItem: T) {
    const currentItems = itemsRef.current;
    const nextItems = currentItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );

    if (onLogAction) await onLogAction("edit", updatedItem);
    await applyChange(nextItems);
  }

  /** Removes an item by ID. */
  async function removeItem(id: string) {
    const currentItems = itemsRef.current;
    const target = currentItems.find((item) => item.id === id);
    if (!target) return;

    const nextItems = currentItems.filter((item) => item.id !== id);

    if (onLogAction) await onLogAction("remove", target);
    await applyChange(nextItems);
  }

  /** Reorders the collection. */
  async function reorderItems(newOrder: T[]) {
    const indexedOrder = newOrder.map((item, index) => ({
      ...item,
      order: index,
    }));

    if (onLogAction && indexedOrder.length > 0) {
      await onLogAction("reorder", indexedOrder[0]);
    }

    await applyChange(indexedOrder);
  }

  /** Updates the name of an item. */
  async function updateItemName(id: string, newName: string) {
    const item = itemsRef.current.find((i) => i.id === id);
    if (!item) return;
    await updateItem({ ...item, name: newName } as T);
  }

  /** Toggles the visibility of an item. */
  async function toggleItemVisibility(id: string) {
    const item = itemsRef.current.find((i) => i.id === id);
    if (!item) return;
    await updateItem({ ...item, visible: !item.visible } as T);
  }

  return {
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
    reorderItems,
    updateItemName,
    toggleItemVisibility,
  };
}
