import type { User } from "firebase/auth";
import { MenuButton, Separator } from "@components";
import type { Friend } from "@features/user";
import type { SearchResult } from "../types";
import { renderSearchItem } from "../utils/renderSearchItem";

interface SearchResultsListProps {
  results: SearchResult[];
  searchTerm: string;
  currentUser: User | null;
  friendList: Friend[];
  setDropdownOpen: (open: boolean) => void;
  onSearchSubmit: (term: string) => void;
}

export function SearchResultsList({
  results,
  searchTerm,
  currentUser,
  friendList,
  setDropdownOpen,
  onSearchSubmit,
}: SearchResultsListProps) {
  return (
    <ul className="text-left">
      {results.slice(0, 8).map((item) =>
        renderSearchItem(item, {
          navigate: (url: string) => window.location.assign(url),
          setDropdownOpen,
          currentUser,
          friendList,
        }),
      )}
      {results.length > 8 && (
        <>
          <Separator className="my-1" />
          <li>
            <MenuButton
              icon={null}
              ariaLabel="See all results"
              onClick={() => onSearchSubmit(searchTerm)}
              className="w-full justify-center"
            >
              See all results
            </MenuButton>
          </li>
        </>
      )}
    </ul>
  );
}
