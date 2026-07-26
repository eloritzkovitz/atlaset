import { createContext, useContext } from "react";
import type { Layer } from "@features/atlas/layers/types";
import type { CountryList } from "@features/countries/types";

export interface CountryListsContextValue {
  countryLists: CountryList[];
  loading: boolean;
  selectedListId: string | null;
  setSelectedListId: (id: string | null) => void;
  reloadCountryLists: () => Promise<CountryList[]>;
  openAddModal: (initialCountryCodes?: string[]) => void;
  openEditModal: (listId: string) => void;
  addList: (list: CountryList) => Promise<void>;
  createListFromLayer: (
    layer: Layer,
    onLinked?: (listId: string) => void,
  ) => Promise<string>;
  handleModalChange: (updatedList: CountryList) => void;
  handleSave: (list: CountryList) => Promise<void>;
  handleUpdate: (list: CountryList) => Promise<void>;
  handleDelete: (list: CountryList) => Promise<void>;
}

export const CountryListsContext = createContext<
  CountryListsContextValue | undefined
>(undefined);

export function useCountryLists() {
  const ctx = useContext(CountryListsContext);
  if (!ctx)
    throw new Error(
      "useCountryLists must be used within a CountryListsProvider",
    );
  return ctx;
}
