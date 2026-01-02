import { useState } from "react";

/**
 * Enables drag-and-drop reordering of a list of items.
 * @param items - The list of items to reorder
 * @param setItems - Function to update the list of items
 * @returns Handlers and state for drag-and-drop functionality
 */
export function useDragReorder<T>(
  items: T[],
  setItems: (newItems: T[]) => void
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Handlers for drag events
  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  // Handle drag over another item
  function handleDragOver(e: React.DragEvent<HTMLLIElement>, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...items];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, removed);
    setDraggedIndex(index);
    setItems(updated);
  }

  // Handle drag end
  function handleDragEnd() {
    setDraggedIndex(null);
  }

  return { draggedIndex, handleDragStart, handleDragOver, handleDragEnd };
}
