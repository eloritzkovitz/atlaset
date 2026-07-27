import type { Country } from "@features/countries";
import type { SerializableUser } from "@features/user/auth/types";
import type { Friend } from "@features/user/friends/types";
import type { SearchResult } from "../types";
import { renderSearchItem } from "../utils/renderSearchItem";

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
        {items.map((item) =>
          renderSearchItem(item, {
            setDropdownOpen: () => {},
            currentUser,
            friendList: friendList || [],
            countries: countries,
          }),
        )}
      </ul>
    </section>
  );
}
