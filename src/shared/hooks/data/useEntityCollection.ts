import { useEffect, useRef, useState } from "react";

/** Represents an entity in the collection. */
export interface Entity {
  id: string;
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
  const isProcessing = useRef(false);

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
    if (isProcessing.current) return;
    isProcessing.current = true;
    try {
      const currentItems = itemsRef.current;
      const nextItems = [...currentItems, newItem];
      if (onLogAction) await onLogAction("add", newItem);
      await applyChange(nextItems);
    } finally {
      isProcessing.current = false;
    }
  }

  /** Edits an existing item. */
  async function updateItem(updatedItem: T) {
    if (isProcessing.current) return;
    isProcessing.current = true;
    try {
      const currentItems = itemsRef.current;
      const nextItems = currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      );
      if (onLogAction) await onLogAction("edit", updatedItem);
      await applyChange(nextItems);
    } finally {
      isProcessing.current = false;
    }
  }

  /** Removes an item by ID. Returns early if target ID is not found. */
  async function removeItem(id: string) {
    if (isProcessing.current) return;

    // Check target FIRST before locking
    const currentItems = itemsRef.current;
    const target = currentItems.find((item) => item.id === id);
    if (!target) return;

    isProcessing.current = true;
    try {
      const nextItems = currentItems.filter((item) => item.id !== id);
      if (onLogAction) await onLogAction("remove", target);
      await applyChange(nextItems);
    } finally {
      isProcessing.current = false;
    }
  }

  /** Reorders the collection. */
  async function reorderItems(newOrder: T[]) {
    if (isProcessing.current) return;
    isProcessing.current = true;
    try {
      if (onLogAction && newOrder.length > 0) {
        await onLogAction("reorder", newOrder[0]);
      }
      await applyChange(newOrder);
    } finally {
      isProcessing.current = false;
    }
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
