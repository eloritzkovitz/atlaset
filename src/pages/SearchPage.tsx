import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "@features/search/hooks/useSearch";
import { SearchResultsList } from "@features/search/components/SearchResultsList";
import { usePageTitle } from "@hooks";

export default function SearchPage() {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const { results, loading } = useSearch(searchTerm);

  usePageTitle("Search | Atlaset");

  // Update searchTerm if query param changes
  useEffect(() => {
    if (queryParam && queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  return (
    <main className="p-4 max-w-6xl mx-auto">
      {loading ? (
        <div className="mt-6 text-muted">Searching...</div>
      ) : searchTerm ? (
        results.length === 0 ? (
          <div className="mt-6 text-muted">No results found.</div>
        ) : (
          <div className="mt-6">
            <SearchResultsList
              results={results}
              searchTerm={searchTerm}
              currentUser={null}
              friendList={[]}
              setDropdownOpen={() => {}}
            />
          </div>
        )
      ) : null}
    </main>
  );
}
