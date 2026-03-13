import type { User } from "firebase/auth";
import {
  CountryFlag,
  getCountryName,
  getCountryRelations,
  type Country,
} from "@features/countries";
import { UserAvatar, type Friend } from "@features/user";
import { getUserLabel } from "./search";
import { SearchItem } from "../components/SearchItem";
import { type SearchResult } from "../types";

interface RenderSearchItemOptions {
  navigate: (url: string) => void;
  setDropdownOpen: (open: boolean) => void;
  currentUser: User | null;
  friendList: Friend[];
  countries: Country[];
}

/**
 * Gets the label for a country search item based on its sovereignty type and relations.
 * @param item The country search result item.
 * @param countries The list of all countries for looking up sovereign names.
 * @returns A string label describing the country's sovereignty status.
 */
function getCountryLabel(item: Country, countries: Country[]) {
  const sovereignName = getCountryName(
    getCountryRelations(item.isoCode).sovereign?.isoCode || "Unknown",
    countries,
  );

  switch (item.sovereigntyType) {
    case "Dependency":
      return sovereignName ? `Dependency of ${sovereignName}` : "Country";
    case "Overseas Region":
      return sovereignName ? `Overseas region of ${sovereignName}` : "Country";
    default:
      return "Country";
  }
}

export function renderSearchItem(
  item: SearchResult,
  {
    navigate,
    setDropdownOpen,
    currentUser,
    friendList,
    countries,
  }: RenderSearchItemOptions,
) {
  if (item.type === "user") {
    return (
      <SearchItem
        key={item.uid}
        item={item}
        displayName={item.displayName || item.username}
        label={getUserLabel(item, currentUser, friendList)}
        icon={<UserAvatar user={item} size={32} />}
        onClick={() => {
          navigate(`/users/${item.username}`);
          setDropdownOpen(false);
        }}
      />
    );
  }
  if (item.type === "country") {
    return (
      <SearchItem
        key={item.isoCode || item.name}
        item={item}
        displayName={item.name}
        label={getCountryLabel(item, countries)}
        icon={
          <CountryFlag
            flag={{ isoCode: item.isoCode, ratio: "3x2", size: "32" }}
          />
        }
        onClick={() => {
          navigate(
            `/dashboard/countries/${item.region}/${item.subregion}/${item.isoCode}`,
          );
          setDropdownOpen(false);
        }}
      />
    );
  }
  return null;
}
