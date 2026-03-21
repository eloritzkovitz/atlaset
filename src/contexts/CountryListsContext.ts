import { createContext, useContext } from "react";
import type { Layer } from "@features/atlas/layers";
import type { CountryList } from "@features/countries/types";

export interface CountryListsContextValue {
  countryLists: CountryList[];
  loading: boolean;
  selectedListId: string | null;
  setSelectedListId: (id: string | null) => void;
  reloadCountryLists: () => Promise<void>;
  addList: (list: CountryList) => Promise<void>;
  createListFromLayer: (
    layer: Layer,
    onLinked?: (listId: string) => void,
  ) => Promise<string>;
  updateList: (list: CountryList) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
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
