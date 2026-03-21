import { useEffect, useState, type ReactNode } from "react";
import type { Layer } from "@features/atlas/layers";
import { countryListService, type CountryList } from "@features/countries";
import {
  CountryListsContext,
  type CountryListsContextValue,
} from "./CountryListsContext";

export function CountryListsProvider({ children }: { children: ReactNode }) {
  const [countryLists, setCountryLists] = useState<CountryList[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

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

  // Updates a list by saving it and reloading all lists
  const updateList = async (list: CountryList) => {
    await countryListService.save(list);
    await reloadCountryLists();
  };

  // Deletes a list and clears selection if it was the selected one
  const deleteList = async (id: string) => {
    await countryListService.delete(id);
    await reloadCountryLists();
    if (selectedListId === id) setSelectedListId(null);
  };

  const value: CountryListsContextValue = {
    countryLists,
    loading,
    selectedListId,
    setSelectedListId,
    reloadCountryLists,
    addList,
    createListFromLayer,
    updateList,
    deleteList,
  };

  return (
    <CountryListsContext.Provider value={value}>
      {children}
    </CountryListsContext.Provider>
  );
}
