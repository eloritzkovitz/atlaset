import type { Country } from "@features/countries/types";
import type { SerializableUser } from "@features/user/auth/types";
import type { Friend } from "@features/user/friends/types";
import { SearchResultItem } from "./SearchResultItem";
import type { SearchResult } from "../../types";
import { getSearchResultKey } from "../../utils/search";

interface SearchSectionProps {
  title: string;
  items: SearchResult[];
  currentUser: SerializableUser | null;
  friendList: Friend[];
  countries: Country[];
}

export function SearchSection({
  title,
  items,
  currentUser,
  friendList,
  countries,
}: SearchSectionProps) {
  if (!items.length) return null;

  return (
    <section className="bg-surface-alt rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul>
        {items.map((item) => (
          <SearchResultItem
            key={getSearchResultKey(item)}
            item={item}
            currentUser={currentUser}
            friendList={friendList || []}
            countries={countries}
            onSelect={() => {}}
          />
        ))}
      </ul>
    </section>
  );
}
