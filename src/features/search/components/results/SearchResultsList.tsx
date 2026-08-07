import { useTranslation } from "react-i18next";
import { MenuButton, Separator } from "@components";
import type { Country } from "@features/countries/types";
import type { SerializableUser } from "@features/user/auth/types";
import type { Friend } from "@features/user/friends/types";
import { SearchResultItem } from "./SearchResultItem";
import type { SearchResult } from "../../types";
import { getSearchResultKey, getSearchRoute } from "../../utils/search";

interface SearchResultsListProps {
  results: SearchResult[];
  searchTerm: string;
  currentUser: SerializableUser | null;
  friendList: Friend[];
  countries: Country[];
  setDropdownOpen: (open: boolean) => void;
  onSearchSubmit: (term: string) => void;
}

export function SearchResultsList({
  results,
  searchTerm,
  currentUser,
  friendList,
  countries,
  setDropdownOpen,
  onSearchSubmit,
}: SearchResultsListProps) {
  const { t } = useTranslation("common");

  return (
    <ul className="text-left">
      {results.slice(0, 8).map((item) => (
        <SearchResultItem
          key={getSearchResultKey(item)}
          item={item}
          currentUser={currentUser}
          friendList={friendList}
          countries={countries}
          onSelect={() => setDropdownOpen(false)}
        />
      ))}
      {results.length > 8 && (
        <>
          <Separator className="my-1" />
          <li>
            <MenuButton
              url={getSearchRoute(searchTerm)}
              ariaLabel={t("components.search.seeAll")}
              onClick={() => onSearchSubmit(searchTerm)}
              className="w-full justify-center"
            >
              {t("components.search.seeAll")}
            </MenuButton>
          </li>
        </>
      )}
    </ul>
  );
}
