import { useEffect, useState, useCallback, type ReactNode } from "react";
import { logUserActivity } from "@features/activity/utils/activity";
import { CountryListModal } from "@features/atlas/countries";
import type { Layer } from "@features/atlas/layers/types";
import { countryListService, type CountryList } from "@features/countries";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useVisitedCountries } from "@features/visits/hooks/useVisitedCountries";
import { useDataLoader } from "@hooks";
import {
  CountryListsContext,
  type CountryListsContextValue,
} from "./CountryListsContext";

export function CountryListsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const {
    visitedCountryCodes,
    wantToVisitCountryCodes,
    addManualCountry,
    removeManualCountry,
    addWantToVisitCountry,
    removeWantToVisitCountry,
  } = useVisitedCountries();

  const [currentList, setCurrentList] = useState<CountryList | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isTrackingList, setIsTrackingList] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Data loader for fetching country lists
  const fetchCountryLists = useCallback(() => countryListService.load(), []);
  const {
    data: loadedLists,
    loading,
    reload: reloadCountryLists,
  } = useDataLoader<CountryList[]>({
    fetchFn: fetchCountryLists,
  });

  const countryLists = loadedLists ?? [];

  // Initial load
  useEffect(() => {
    reloadCountryLists();
  }, [reloadCountryLists]);

  // Closes out modal state and completely flushes tracking records
  const closeModal = () => {
    setModalOpen(false);
    setCurrentList(null);
    setIsEditing(false);
    setIsTrackingList(false);
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
    // Special handling for tracking lists
    if (listId === "VISITED_COUNTRIES") {
      setCurrentList({
        id: "VISITED_COUNTRIES",
        name: "Visited Countries",
        countryCodes: visitedCountryCodes,
      });
      setIsEditing(true);
      setIsTrackingList(true);
      setModalOpen(true);
      return;
    }

    if (listId === "WANT_TO_VISIT") {
      setCurrentList({
        id: "WANT_TO_VISIT",
        name: "Want to Visit",
        countryCodes: wantToVisitCountryCodes,
      });
      setIsEditing(true);
      setIsTrackingList(true);
      setModalOpen(true);
      return;
    }

    // Standard handling for user-defined lists
    const list = countryLists.find((l) => l.id === listId);
    if (list) {
      setCurrentList({ ...list });
      setIsEditing(true);
      setIsTrackingList(false);
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

    if (user?.uid) {
      await logUserActivity(
        241,
        { itemName: layer.name, userName: user.displayName },
        user.uid,
      );
    }

    if (onLinked) onLinked(newListId);
    return newListId;
  };

  // Shared form modification pipeline
  const handleModalChange = async (updatedList: CountryList) => {
    if (isTrackingList && updatedList) {
      const currentCodes = currentList?.countryCodes || [];
      const newCodes = updatedList.countryCodes;

      const added = newCodes.find((code) => !currentCodes.includes(code));
      const removed = currentCodes.find((code) => !newCodes.includes(code));

      // Determine if this modal instance belongs to the Want to Visit List
      const isWantToVisitList = updatedList.id === "WANT_TO_VISIT";

      if (isWantToVisitList) {
        // Process Want to Visit List modifications
        if (added) {
          await addWantToVisitCountry(added);
        } else if (removed) {
          await removeWantToVisitCountry(removed);
        }
      } else {
        // Process Visited Countries modifications
        if (added) {
          await addManualCountry(added);
        } else if (removed) {
          await removeManualCountry(removed);
        }
      }

      // Update local state display layout inside the open modal
      setCurrentList({
        ...updatedList,
        countryCodes: newCodes,
      });
      return;
    }

    // Standard custom list processing path
    setCurrentList(updatedList);
  };

  // Adds or saves a list and reloads all lists
  const handleSave = async (list: CountryList) => {
    const withId = { ...list, id: list.id ?? crypto.randomUUID() };
    await countryListService.save(withId);

    if (user?.uid) {
      await logUserActivity(
        241,
        { itemName: list.name, userName: user.displayName },
        user.uid,
      );
    }

    await reloadCountryLists();
    closeModal();
  };

  // Updates a list by saving it and reloading all lists
  const handleUpdate = async (list: CountryList) => {
    // Prevent updates to tracking lists, which are managed by the application
    if (isTrackingList) {
      return;
    }

    await countryListService.save(list);
    await reloadCountryLists();

    if (user?.uid) {
      await logUserActivity(
        242,
        { itemName: list.name, userName: user.displayName },
        user.uid,
      );
    }

    closeModal();
  };

  // Deletes a list and clears selection if it was the selected one
  const handleDelete = async (list: CountryList) => {
    const listToDelete = countryLists.find((l) => l.id === list.id);

    await countryListService.delete(list);
    await reloadCountryLists();

    if (user?.uid) {
      await logUserActivity(
        243,
        {
          itemName: listToDelete?.name ?? "Unknown List",
          userName: user.displayName,
        },
        user.uid,
      );
    }

    if (selectedListId === list.id) setSelectedListId(null);
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
        isTrackingList={isTrackingList}
        list={currentList}
        onChange={handleModalChange}
        onSave={isEditing ? handleUpdate : handleSave}
        onDelete={isTrackingList ? undefined : handleDelete}
        onClose={closeModal}
      />
    </CountryListsContext.Provider>
  );
}
