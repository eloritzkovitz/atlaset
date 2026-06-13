import { useEffect, useState, type ReactNode } from "react";
import { CountryListModal } from "@features/atlas/countries";
import type { Layer } from "@features/atlas/layers";
import { countryListService, type CountryList } from "@features/countries";
import {
  CountryListsContext,
  type CountryListsContextValue,
} from "./CountryListsContext";

export function CountryListsProvider({ children }: { children: ReactNode }) {
  const [countryLists, setCountryLists] = useState<CountryList[]>([]);
  const [currentList, setCurrentList] = useState<CountryList | null>(null);  
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  

  // Reloads the country lists from the service
  const reloadCountryLists = async () => {
    setLoading(true);
    const lists = await countryListService.load();
    setCountryLists(lists);
    setLoading(false);
  };

  // Load lists on mount
  useEffect(() => {
    reloadCountryLists();
  }, []);

  // Closes out modal state and completely flushes tracking records
  const closeModal = () => {
    setModalOpen(false);
    setCurrentList(null);
    setIsEditing(false);
  };

  // Opens the modal for adding a new list, optionally pre-filling with country codes
  const openAddModal = (initialCountryCodes: string[] = []) => {
    setCurrentList({
      id: crypto.randomUUID(),
      name: "",
      countryCodes: initialCountryCodes,
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  // Opens the modal for editing an existing list
  const openEditModal = (listId: string) => {
    const list = countryLists.find((l) => l.id === listId);
    if (list) {
      setCurrentList({ ...list });
      setIsEditing(true);
      setModalOpen(true);
    }
  };

  // Adds a new list and reloads all lists
  const addList = async (list: CountryList) => {
    const withId = { ...list, id: list.id ?? crypto.randomUUID() };
    await countryListService.save(withId);
    await reloadCountryLists();
  };

  // Creates a new country list from a layer and returns the new list id
  const createListFromLayer = async (
    layer: Layer,
    onLinked?: (listId: string) => void,
  ) => {
    const newListId = crypto.randomUUID();
    await addList({
      id: newListId,
      name: layer.name,
      countryCodes: layer.countries,
      layerId: layer.id,
    });
    if (onLinked) onLinked(newListId);
    return newListId;
  };

  // Shared form modification pipeline
  const handleModalChange = (updatedList: CountryList) => {
    setCurrentList(updatedList);
  };

  // Adds or saves a list and reloads all lists
  const handleSave = async (list: CountryList) => {
    const withId = { ...list, id: list.id ?? crypto.randomUUID() };
    await countryListService.save(withId);
    await reloadCountryLists();
    closeModal();
  };

  // Updates a list by saving it and reloading all lists
  const handleUpdate = async (list: CountryList) => {
    await countryListService.save(list);
    await reloadCountryLists();
    closeModal();
  };

  // Deletes a list and clears selection if it was the selected one
  const handleDelete = async (id: string) => {
    await countryListService.delete(id);
    await reloadCountryLists();
    if (selectedListId === id) setSelectedListId(null);
    closeModal();
  };

  const value: CountryListsContextValue = {
    countryLists,
    loading,
    selectedListId,
    setSelectedListId,
    reloadCountryLists,
    openAddModal,
    openEditModal,
    addList,
    createListFromLayer,
    handleModalChange,
    handleSave,
    handleUpdate,
    handleDelete,
  };

  return (
    <CountryListsContext.Provider value={value}>
      {children}
      <CountryListModal
        isOpen={modalOpen}
        isEditing={isEditing}
        list={currentList}
        onChange={handleModalChange}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={closeModal}
      />
    </CountryListsContext.Provider>
  );
}
