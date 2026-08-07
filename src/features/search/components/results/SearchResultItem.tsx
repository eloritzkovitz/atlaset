import i18n from "i18next";
import { ICONS } from "@constants/icons";
import { CountryFlag, RegionIcon, type Country } from "@features/countries";
import { getCountryRoute } from "@features/dashboard/core";
import { UserAvatar } from "@features/user/profile";
import type { SerializableUser } from "@features/user/auth/types";
import { type Friend } from "@features/user/friends/types";
import { SearchItem } from "./SearchItem";
import { type SearchResult } from "../../types";
import { getCountryLabel, getUserLabel } from "../../utils/search";

interface SearchResultItemProps {
  item: SearchResult;
  currentUser: SerializableUser | null;
  friendList: Friend[];
  countries: Country[];
  onSelect: () => void;
}

export function SearchResultItem({
  item,
  currentUser,
  friendList,
  countries,
  onSelect,
}: SearchResultItemProps) {
  let url: string;
  let displayName: string;
  let label: string;
  let icon: React.ReactNode;

  switch (item.type) {
    case "user":
      url = `/users/${item.username}`;
      displayName = item.displayName || item.username;
      label = getUserLabel(item, currentUser, friendList);
      icon = <UserAvatar user={item} size={32} />;
      break;

    case "country":
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
      url = `/dashboard/currencies/${item.code}`;
      displayName = `${item.name} (${item.code})`;
      label = i18n.t("countries:labels.currency");
      icon = <ICONS.currencies className="2xl" />;
      break;

    case "region":
    case "subregion": {
      const isSub = item.type === "subregion";
      const regKey = item.region;

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
      icon = <RegionIcon region={regKey} />;
      break;
    }

    default:
      return null;
  }

  return (
    <SearchItem
      url={url}
      item={item}
      displayName={displayName}
      label={label}
      icon={icon}
      onClick={onSelect}
    />
  );
}
