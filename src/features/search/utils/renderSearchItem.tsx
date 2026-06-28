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
import { getCountryRoute } from "@features/dashboard";
import { UserAvatar, type Friend } from "@features/user";
import { getUserLabel } from "./search";
import { SearchItem } from "../components/SearchItem";
import { type SearchResult } from "../types";

interface RenderSearchItemOptions {
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
function getCountryLabel(item: Country, countries: Country[]): string {
  if (
    item.sovereigntyStatus === "dependency" ||
    item.sovereigntyStatus === "overseas_region"
  ) {
    const sovereignName = getCountryName(
      item.sovereignState || "Unknown",
      countries,
    );
    if (sovereignName) {
      return i18n.t(`countries:labels.${item.sovereigntyStatus}_of`, {
        sovereign: sovereignName,
      });
    }
  }
  return i18n.t("countries:labels.country", { defaultValue: "Country" });
}

/**
 * Renders a search item based on its type.
 * @param item - The search result item.
 */
export function renderSearchItem(
  item: SearchResult,
  {
    setDropdownOpen,
    currentUser,
    friendList,
    countries,
  }: RenderSearchItemOptions,
) {
  let key: string;
  let url: string;
  let displayName: string;
  let label: string;
  let icon: React.ReactNode;

  switch (item.type) {
    case "user":
      key = item.uid;
      url = `/users/${item.username}`;
      displayName = item.displayName || item.username;
      label = getUserLabel(item, currentUser, friendList);
      icon = <UserAvatar user={item} size={32} />;
      break;

    case "country":
      key = item.isoCode || item.name;
      url = getCountryRoute(item.region, item.subregion, item.isoCode);
      displayName = item.name;
      label = getCountryLabel(item, countries);
      icon = (
        <CountryFlag
          flag={{
            isoCode: item.isoCode,
            sovereignState: item.sovereignState,
            ratio: "3x2",
            size: "32",
          }}
        />
      );
      break;

    case "currency":
      key = item.code;
      url = `/dashboard/currencies/${item.code}`;
      displayName = `${item.name} (${item.code})`;
      label = i18n.t("countries:labels.currency");
      icon = <ICONS.currencies className="2xl" />;
      break;

    case "region":
    case "subregion": {
      const isSub = item.type === "subregion";
      const regKey = item.region;

      key = isSub ? `${regKey}-${item.subregion}` : regKey;
      url = getCountryRoute(regKey, isSub ? item.subregion : undefined);
      displayName = i18n.t(
        `countries:${isSub ? "subregions" : "regions"}.${regKey}${isSub ? `.${item.subregion}` : ""}`,
        {
          defaultValue: isSub ? item.subregion : regKey,
        },
      );
      label = isSub
        ? i18n.t("countries:labels.subregion_in", {
            region: i18n.t(`countries:regions.${regKey}`, {
              defaultValue: regKey,
            }),
          })
        : i18n.t("countries:labels.region", { defaultValue: "Region" });
      icon = regionIcons[regKey] || defaultRegionIcon;
      break;
    }

    default:
      return null;
  }

  return (
    <SearchItem
      key={key}
      url={url}
      item={item}
      displayName={displayName}
      label={label}
      icon={icon}
      onClick={() => setDropdownOpen(false)}
    />
  );
}
