import type { User } from "firebase/auth";
import { ICONS } from "@constants/icons";
import i18n from "i18next";
import {
  CountryFlag,
  defaultRegionIcon,
  getCountryName,
  regionIcons,
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
    item.sovereignState || "Unknown",
    countries,
  );
  const t = (k: string, vars?: Record<string, unknown>) => i18n.t(k, vars);
  switch (item.sovereigntyStatus) {
    case "dependency":
      return sovereignName
        ? t("countries:labels.dependency_of", { sovereign: sovereignName })
        : i18n.t("countries:labels.country", { defaultValue: "Country" });
    case "overseas_region":
      return sovereignName
        ? t("countries:labels.overseas_region_of", { sovereign: sovereignName })
        : i18n.t("countries:labels.country", { defaultValue: "Country" });
    default:
      return i18n.t("countries:labels.country", { defaultValue: "Country" });
  }
}

/**
 * Renders a search item for a region or subregion.
 * @param item - The search result item representing a region or subregion.
 * @param navigate - Function to navigate to a different URL.
 * @param setDropdownOpen - Function to set the dropdown open state.
 * @returns A JSX element representing the search item.
 */
function renderAreaItem(
  item: Extract<SearchResult, { type: "region" | "subregion" }>,
  navigate: (url: string) => void,
  setDropdownOpen: (open: boolean) => void,
) {
  const icon = regionIcons[item.region] || defaultRegionIcon;
  const isSubregion = item.type === "subregion";

  // Get localized region name for display and label construction
  const regionKey = item.region;
  const localizedRegion = i18n.t(`countries:regions.${regionKey}`, {
    defaultValue: regionKey,
  }) as string;

  const localizedSubregion = isSubregion
    ? (i18n.t(`countries:subregions.${regionKey}.${item.subregion}`, {
        defaultValue: item.subregion,
      }) as string)
    : undefined;

  return (
    <SearchItem
      key={isSubregion ? `${regionKey}-${item.subregion}` : regionKey}
      item={item}
      displayName={
        isSubregion ? (localizedSubregion ?? item.subregion) : localizedRegion
      }
      label={
        isSubregion
          ? i18n.t("countries:labels.subregion_in", { region: localizedRegion })
          : i18n.t("countries:labels.region", { defaultValue: "Region" })
      }
      icon={icon}
      onClick={() => {
        navigate(
          isSubregion
            ? `/dashboard/countries/${regionKey}/${item.subregion}`
            : `/dashboard/countries/${regionKey}`,
        );
        setDropdownOpen(false);
      }}
    />
  );
}

/**
 * Renders a search item based on its type.
 * @param item - The search result item.
 */
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
  switch (item.type) {
    case "user":
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
    case "country":
      return (
        <SearchItem
          key={item.isoCode || item.name}
          item={item}
          displayName={item.name}
          label={getCountryLabel(item, countries)}
          icon={
            <CountryFlag
              flag={{
                isoCode: item.isoCode,
                sovereignState: item.sovereignState,
                ratio: "3x2",
                size: "32",
              }}
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
    case "currency":
      return (
        <SearchItem
          key={item.code}
          item={item}
          displayName={`${item.name} (${item.code})`}
          label={i18n.t("countries:labels.currency")}
          icon={<ICONS.currencies className="2xl" />}
          onClick={() => {
            navigate(`/dashboard/currencies/${item.code}`);
            setDropdownOpen(false);
          }}
        />
      );
    case "region":
    case "subregion":
      return renderAreaItem(
        item as Extract<SearchResult, { type: "region" | "subregion" }>,
        navigate,
        setDropdownOpen,
      );
    default:
      return null;
  }
}
