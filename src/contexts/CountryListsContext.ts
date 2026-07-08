import { createContext, useContext } from "react";
import type { Layer } from "@features/atlas/layers";
import type { CountryList, SovereigntyStatus } from "@features/countries";
import type { VisitedStatus } from "@features/visits";

export interface CountryListsContextValue {
  countryLists: CountryList[];
  loading: boolean;
  selectedListId: string | null;
  setSelectedListId: (id: string | null) => void;
  sovereignOnly: boolean;
  setSovereignOnly: React.Dispatch<React.SetStateAction<boolean>>;
  showVisitedOnly: boolean;
  setShowVisitedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  wantToVisitOnly: boolean;
  setWantToVisitOnly: React.Dispatch<React.SetStateAction<boolean>>;
  sovereignState: { value: SovereigntyStatus | ""; only: boolean };
  setSovereignState: React.Dispatch<
    React.SetStateAction<{ value: SovereigntyStatus | ""; only: boolean }>
  >;
  visitedState: { value: VisitedStatus; wantToVisitOnly: boolean };
  setVisitedState: React.Dispatch<
    React.SetStateAction<{ value: VisitedStatus; wantToVisitOnly: boolean }>
  >;
  reloadCountryLists: () => Promise<void>;
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
  handleDelete: (id: string) => Promise<void>;
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
