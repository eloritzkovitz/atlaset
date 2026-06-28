import type { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { MenuButton, Separator } from "@components";
import type { Country } from "@features/countries";
import type { Friend } from "@features/user";
import type { SearchResult } from "../types";
import { renderSearchItem } from "../utils/renderSearchItem";
import { getSearchRoute } from "../utils/search";

interface SearchResultsListProps {
  results: SearchResult[];
  searchTerm: string;
  currentUser: User | null;
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
      {results.slice(0, 8).map((item) =>
        renderSearchItem(item, {
          setDropdownOpen,
          currentUser,
          friendList,
          countries,
        }),
      )}
      {results.length > 8 && (
        <>
          <Separator className="my-1" />
          <li>
            <MenuButton
              url={getSearchRoute(searchTerm)}
              icon={null}
              ariaLabel={t("search.seeAll")}
              onClick={() => onSearchSubmit(searchTerm)}
              className="w-full justify-center"
            >
              {t("search.seeAll")}
            </MenuButton>
          </li>
        </>
      )}
    </ul>
  );
}
