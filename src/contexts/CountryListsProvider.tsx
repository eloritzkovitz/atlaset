import { useEffect, useState, type ReactNode } from "react";
import { countryListService } from "@features/countries/services/countryListService";
import type { CountryList } from "@features/countries";
import {
  CountryListsContext,
  type CountryListsContextValue,
} from "./CountryListsContext";

export function CountryListsProvider({ children }: { children: ReactNode }) {
  const [countryLists, setCountryLists] = useState<CountryList[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Reloads the country lists from the service
  const reload = async () => {
    setLoading(true);
    const lists = await countryListService.load();
    setCountryLists(lists);
    setLoading(false);
  };

  // Adds a new list and reloads all lists
  const addList = async (list: CountryList) => {
    await countryListService.save(list);
    await reload();
  };

  // Updates a list by saving it and reloading all lists
  const updateList = async (list: CountryList) => {
    await countryListService.save(list);
    await reload();
  };

  // Deletes a list and clears selection if it was the selected one
  const deleteList = async (id: string) => {
    await countryListService.delete(id);
    await reload();
    if (selectedListId === id) setSelectedListId(null);
  };

  // Load lists on mount
  useEffect(() => {
    reload();
  }, []);

  const value: CountryListsContextValue = {
    countryLists,
    loading,
    selectedListId,
    setSelectedListId,
    reload,
    addList,
    updateList,
    deleteList,
  };

  return (
    <CountryListsContext.Provider value={value}>
      {children}
    </CountryListsContext.Provider>
  );
}
