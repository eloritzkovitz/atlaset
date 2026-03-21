import { useState } from "react";
import type { CountryList } from "@features/countries";

interface UseCountryListModalProps {
  addList: (list: CountryList) => Promise<void>;
  deleteList: (id: string) => void;
  countryLists: CountryList[];
}

/**
 * Manages state and handlers for the country list modal,
 * @returns An object containing state and handlers for country list modal
 */
export function useCountryListModal({
  addList,
  deleteList,
  countryLists,
}: UseCountryListModalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentList, setCurrentList] = useState<CountryList | null>(null);

  // Open modal for adding a new list
  function openAddModal() {
    setCurrentList({ id: crypto.randomUUID(), name: "", countryCodes: [] });
    setIsEditing(false);
    setModalOpen(true);
  }

  // Open modal for editing a list
  function openEditModal(listId: string) {
    const list = countryLists.find((l) => l.id === listId);
    if (list) {
      setCurrentList({ ...list });
      setIsEditing(true);
      setModalOpen(true);
    }
  }

  // Save (add or update) list
  async function handleSave(list: CountryList) {
    await addList(list);
    setModalOpen(false);
    setCurrentList(null);
    setIsEditing(false);
  }

  // Delete list
  function handleDelete(listId: string) {
    deleteList(listId);
    setModalOpen(false);
    setCurrentList(null);
    setIsEditing(false);
  }

  // Close modal
  function handleClose() {
    setModalOpen(false);
    setCurrentList(null);
    setIsEditing(false);
  }

  // Change list
  function handleChange(list: CountryList) {
    setCurrentList(list);
  }

  return {
    modalOpen,
    isEditing,
    currentList,
    openAddModal,
    openEditModal,
    handleSave,
    handleDelete,
    handleClose,
    handleChange,
  };
}
