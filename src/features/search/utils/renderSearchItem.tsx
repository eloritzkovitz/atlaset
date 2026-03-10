import { CountryFlag } from "@features/countries";
import { useAuth, UserAvatar, useUserFriends } from "@features/user";
import { getUserLabel } from "./search";
import { SearchItem } from "../components/SearchItem";
import { type SearchResult } from "../types";

interface RenderSearchItemOptions {
  navigate: (url: string) => void;
  setDropdownOpen: (open: boolean) => void;
}

export function renderSearchItem(
  item: SearchResult,
  { navigate, setDropdownOpen }: RenderSearchItemOptions,
) {
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);

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
        label="Country"
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
