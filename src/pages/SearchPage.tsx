import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EmptyListMessage, SegmentedToggle } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { SearchSection, useSearch } from "@features/search";
import { useUserFriends } from "@features/user";
import { usePageTitle } from "@hooks";

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
  }, [queryParam, searchTerm]);

  const sections = [
    {
      key: "users" as const,
      title: "Users",
      items: results.filter((item) => item.type === "user"),
    },
    {
      key: "countries" as const,
      title: "Countries",
      items: results.filter((item) => item.type === "country"),
    },
  ];

  const [activeSection, setActiveSection] = useState<
    "all" | "users" | "countries"
  >("all");

  return (
    <main className="p-4 max-w-6xl mx-auto mt-12">
      {loading ? (
        <EmptyListMessage message="Searching..." />
      ) : searchTerm ? (
        results.length === 0 ? (
          <EmptyListMessage message="No results found." />
        ) : (
          <>
            <SegmentedToggle
              value={activeSection}
              onChange={setActiveSection}
              options={[
                { value: "all", label: "All" },
                ...sections.map((section) => ({
                  value: section.key,
                  label: section.title,
                  count: section.items.length,
                })),
              ]}
              className="mb-6"
            />
            <div className="mt-6 grid gap-8">
              {sections.map(
                (section) =>
                  (activeSection === "all" ||
                    activeSection === section.key) && (
                    <SearchSection
                      key={section.key}
                      title={section.title}
                      items={section.items}
                      currentUser={currentUser}
                      friendList={friendList || []}
                    />
                  ),
              )}
            </div>
          </>
        )
      ) : null}
    </main>
  );
}
