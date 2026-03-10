import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useSearch } from "@features/search/hooks/useSearch";
import { renderSearchItem } from "@features/search/utils/renderSearchItem";
import { useUserFriends } from "@features/user";
import { usePageTitle } from "@hooks";
import { EmptyListMessage } from "@components";

export default function SearchPage() {
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const { results, loading } = useSearch(searchTerm);

  usePageTitle(`${searchTerm ? `${searchTerm}` : ""} - Atlaset`);

  // Update searchTerm if query param changes
  useEffect(() => {
    if (queryParam && queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  // Group results by type
  const userResults = results.filter((item) => item.type === "user");
  const countryResults = results.filter((item) => item.type === "country");

  // Render a section for a given result type
  function renderSection(
    title: string,
    items: typeof userResults | typeof countryResults,
  ) {
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

  return (
    <main className="p-4 max-w-6xl mx-auto mt-12">
      {loading ? (
        <EmptyListMessage message="Searching..." />
      ) : searchTerm ? (
        results.length === 0 ? (
          <EmptyListMessage message="No results found." />
        ) : (
          <div className="mt-6 grid gap-8">
            {[
              { title: "Users", items: userResults },
              { title: "Countries", items: countryResults },
            ].map(({ title, items }) => renderSection(title, items))}
          </div>
        )
      ) : null}
    </main>
  );
}
