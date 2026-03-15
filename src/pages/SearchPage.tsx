import { useState } from "react";
import { useLocation } from "react-router-dom";
import { EmptyListMessage, SegmentedToggle } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useCountryData } from "@features/countries";
import { SearchSection, useSearch } from "@features/search";
import { useUserFriends } from "@features/user";
import { usePageTitle } from "@hooks";

export default function SearchPage() {
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);
  const { countries } = useCountryData();
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("query") || "";
  const { results, loading } = useSearch(queryParam);

  usePageTitle(`${queryParam ? `${queryParam}` : ""} - Atlaset`);

  const sections = [
    {
      key: "people" as const,
      title: "People",
      items: results.filter((item) => item.type === "user"),
    },
    {
      key: "countries" as const,
      title: "Countries",
      items: results.filter((item) => item.type === "country"),
    },
    {
      key: "currencies" as const,
      title: "Currencies",
      items: results.filter((item) => item.type === "currency"),
    },
    {
      key: "regions" as const,
      title: "Regions",
      items: results.filter((item) => item.type === "region"),
    },
    {
      key: "subregions" as const,
      title: "Subregions",
      items: results.filter((item) => item.type === "subregion"),
    },
  ];

  const [activeSection, setActiveSection] = useState<
    "all" | "people" | "countries" | "currencies" | "regions" | "subregions"
  >("all");

  return (
    <main className="p-4 max-w-6xl mx-auto mt-12">
      {loading ? (
        <EmptyListMessage message="Searching..." />
      ) : queryParam ? (
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
                      countries={countries}
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
