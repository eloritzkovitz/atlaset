import { useCallback, useEffect, useState, type ReactNode } from "react";
import { logUserActivity } from "@features/activity";
import type { Layer } from "@features/atlas/layers/types";
import { countryListService } from "@features/countries";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useCountryTracking } from "@features/visits/hooks/useCountryTracking";
import { useDataLoader, useDisclosure } from "@hooks";
import {
  CountryListsContext,
  type CountryListsContextValue,
} from "./CountryListsContext";
import { CountryListModal } from "../components/countriesPanel/CountryListModal";
import type { CountryList } from "../types";

export function CountryListsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const {
    visitedCountryCodes,
    wantToVisitCountryCodes,
    addManualCountry,
    removeManualCountry,
    addWantToVisitCountry,
    removeWantToVisitCountry,
  } = useCountryTracking();

  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Modal state for managing the country list modal
  const modal = useDisclosure<{
    list: CountryList;
    isEditing: boolean;
  }>();

  // Determine the current list and its state
  const currentList = modal.data?.list ?? null;
  const isEditing = modal.data?.isEditing ?? false;
  const isTrackingList =
    currentList?.id === "VISITED_COUNTRIES" ||
    currentList?.id === "WANT_TO_VISIT";

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

  // Opens modal for creating a new list
  const openAddModal = (initialCountryCodes: string[] = []) => {
    modal.open({
      isEditing: false,
      list: {
        id: crypto.randomUUID(),
        name: "",
        countryCodes: initialCountryCodes,
      },
    });
  };

  // Opens modal for editing an existing list
  const openEditModal = (listId: string) => {
    if (listId === "VISITED_COUNTRIES") {
      modal.open({
        isEditing: true,
        list: {
          id: "VISITED_COUNTRIES",
          name: "Visited Countries",
          countryCodes: visitedCountryCodes,
        },
      });
      return;
    }

    if (listId === "WANT_TO_VISIT") {
      modal.open({
        isEditing: true,
        list: {
          id: "WANT_TO_VISIT",
          name: "Want to Visit",
          countryCodes: wantToVisitCountryCodes,
        },
      });
      return;
    }

    const list = countryLists.find((l) => l.id === listId);
    if (list) {
      modal.open({
        isEditing: true,
        list: { ...list },
      });
    }
  };

  // Adds a new list and reloads
  const addList = async (list: CountryList) => {
    const withId = { ...list, id: list.id ?? crypto.randomUUID() };
    await countryListService.save(withId);
    await reloadCountryLists();
  };

  // Creates list from layer
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

  // Handles real-time modal updates
  const handleModalChange = async (updatedList: CountryList) => {
    if (isTrackingList && updatedList && currentList) {
      const currentCodes = currentList.countryCodes || [];
      const newCodes = updatedList.countryCodes;

      const added = newCodes.find((code) => !currentCodes.includes(code));
      const removed = currentCodes.find((code) => !newCodes.includes(code));

      if (updatedList.id === "WANT_TO_VISIT") {
        if (added) await addWantToVisitCountry(added);
        else if (removed) await removeWantToVisitCountry(removed);
      } else {
        if (added) await addManualCountry(added);
        else if (removed) await removeManualCountry(removed);
      }

      modal.setData({
        isEditing: true,
        list: { ...updatedList, countryCodes: newCodes },
      });
      return;
    }

    modal.setData({
      isEditing,
      list: updatedList,
    });
  };

  // Saves a new list
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
    modal.close();
  };

  // Updates an existing list
  const handleUpdate = async (list: CountryList) => {
    if (isTrackingList) return;

    await countryListService.save(list);
    await reloadCountryLists();

    if (user?.uid) {
      await logUserActivity(
        242,
        { itemName: list.name, userName: user.displayName },
        user.uid,
      );
    }

    modal.close();
  };

  // Deletes a list
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
    modal.close();
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
        isOpen={modal.isOpen}
        isEditing={isEditing}
        isTrackingList={isTrackingList}
        list={currentList}
        onChange={handleModalChange}
        onSave={isEditing ? handleUpdate : handleSave}
        onDelete={isTrackingList ? undefined : handleDelete}
        onClose={modal.close}
      />
    </CountryListsContext.Provider>
  );
}
