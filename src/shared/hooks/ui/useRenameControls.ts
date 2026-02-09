import { useState, useCallback, useEffect } from "react";

interface UseRenameControlsProps {
  name: string;
  onNameChange?: (newName: string) => void;
}

/**
 * Manages rename state and handlers for components that allow renaming items.
 * @param name - The current name of the item.
 * @param onNameChange - Optional callback invoked when the name changes.
 * @returns An object containing the rename state and handler functions.
 */
export function useRenameControls({
  name,
  onNameChange,
}: UseRenameControlsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  // Sync editName if name prop changes externally
  useEffect(() => {
    setEditName(name);
  }, [name]);

  // Start editing
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Save new name
  const handleSave = useCallback(() => {
    setIsEditing(false);
    if (editName !== name) {
      if (onNameChange) onNameChange(editName);
    }
  }, [editName, name, onNameChange]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditName(name);
  }, [name]);

  // Blur handler
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (editName !== name) {
      if (onNameChange) onNameChange(editName);
    }
  }, [editName, name, onNameChange]);

  // Keydown handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setIsEditing(false);
        if (editName !== name) {
          if (onNameChange) onNameChange(editName);
        }
      }
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsEditing(false);
        setEditName(name);
      }
    },
    [editName, name, onNameChange],
  );

  return {
    isEditing,
    editName,
    setEditName,
    handleEdit,
    handleSave,
    handleCancel,
    handleBlur,
    handleKeyDown,
  };
}
