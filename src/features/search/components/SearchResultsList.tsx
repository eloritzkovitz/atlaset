import type { User } from "firebase/auth";
import { MenuButton, Separator } from "@components";
import { useTranslation } from "react-i18next";
import type { Country } from "@features/countries";
import type { Friend } from "@features/user";
import type { SearchResult } from "../types";
import { renderSearchItem } from "../utils/renderSearchItem";

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
          navigate: (url: string) => window.location.assign(url),
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
