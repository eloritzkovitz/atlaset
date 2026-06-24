import { useEffect, useState, type ReactNode } from "react";
import { CountryListModal } from "@features/atlas/countries";
import type { Layer } from "@features/atlas/layers";
import { countryListService, type CountryList } from "@features/countries";
import { useVisitedCountries } from "@features/visits";
import {
  CountryListsContext,
  type CountryListsContextValue,
} from "./CountryListsContext";

export function CountryListsProvider({ children }: { children: ReactNode }) {
  const { visitedCountryCodes, addManualCountry, removeManualCountry } =
    useVisitedCountries();

  const [countryLists, setCountryLists] = useState<CountryList[]>([]);
  const [currentList, setCurrentList] = useState<CountryList | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isSystemList, setIsSystemList] = useState(false);
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
    setIsSystemList(false);
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
    // Special handling for the "visited" system list
    if (listId === "VISITED_COUNTRIES") {
      setCurrentList({
        id: "VISITED_COUNTRIES",
        name: "Visited Countries",
        countryCodes: visitedCountryCodes,
      });
      setIsEditing(true);
      setIsSystemList(true);
      setModalOpen(true);
      return;
    }

    // Standard handling for user-defined lists
    const list = countryLists.find((l) => l.id === listId);
    if (list) {
      setCurrentList({ ...list });
      setIsEditing(true);
      setIsSystemList(false);
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
  const handleModalChange = async (updatedList: CountryList) => {
    // Special handling for the "visited" system list
    if (isSystemList) {
      // Determine what country code was checked or unchecked
      const currentCodes = currentList?.countryCodes || [];
      const newCodes = updatedList.countryCodes;

      const added = newCodes.find((code) => !currentCodes.includes(code));
      const removed = currentCodes.find((code) => !newCodes.includes(code));

      // Update the visited countries service based on the change
      if (added) {
        await addManualCountry(added);
      } else if (removed) {
        await removeManualCountry(removed);
      }

      // Update local state display layout inside the open modal
      setCurrentList({
        ...updatedList,
        countryCodes: newCodes,
      });
      return;
    }

    // Standard list processing path
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
    // Special handling for the "visited" system list
    if (isSystemList) {
      return;
    }

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
        isSystemList={isSystemList}
        list={currentList}
        onChange={handleModalChange}
        onSave={isEditing ? handleUpdate : handleSave}
        onDelete={isSystemList ? undefined : handleDelete}
        onClose={closeModal}
      />
    </CountryListsContext.Provider>
  );
}
