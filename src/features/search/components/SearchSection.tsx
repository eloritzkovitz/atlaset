import type { User } from "firebase/auth";
import type { Friend } from "@features/user";
import type { SearchResult } from "../types";
import { renderSearchItem } from "../utils/renderSearchItem";

interface SearchSectionProps {
  title: string;
  items: SearchResult[];
  currentUser: User | null;
  friendList: Friend[];
}

export function SearchSection({
  title,
  items,
  currentUser,
  friendList,
}: SearchSectionProps) {
  if (!items.length) return null;
  return (
    <section className="bg-surface-alt rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <ul>
        {items.map((item) =>
          renderSearchItem(item, {
            navigate: (url) => window.location.assign(url),
            setDropdownOpen: () => {},
            currentUser,
            friendList: friendList || [],
          }),
        )}
      </ul>
    </section>
  );
}
