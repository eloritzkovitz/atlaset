import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { EmptyListMessage, SegmentedToggle } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useCountryData } from "@features/countries";
import { SearchSection, useSearch } from "@features/search";
import { useUserFriends } from "@features/user/friends";
import { usePageTitle } from "@hooks";
import { Container } from "@layouts";
import { getQueryParam } from "@utils/url";

export default function SearchPage() {
  const { user: currentUser } = useAuth();
  const { countries } = useCountryData();
  const location = useLocation();
  const { t } = useTranslation("common");
  const { friends: friendList } = useUserFriends(currentUser?.uid);

  const queryParam = getQueryParam("query", location.search);
  const { results, loading } = useSearch(queryParam);

  usePageTitle(
    queryParam ? t("search.pageTitle", { query: queryParam }) : undefined,
  );

  const sections = [
    {
      key: "people" as const,
      title: t("search.sections.people"),
      items: results.filter((item) => item.type === "user"),
    },
    {
      key: "countries" as const,
      title: t("search.sections.countries"),
      items: results.filter((item) => item.type === "country"),
    },
    {
      key: "currencies" as const,
      title: t("search.sections.currencies"),
      items: results.filter((item) => item.type === "currency"),
    },
    {
      key: "regions" as const,
      title: t("search.sections.regions"),
      items: results.filter((item) => item.type === "region"),
    },
    {
      key: "subregions" as const,
      title: t("search.sections.subregions"),
      items: results.filter((item) => item.type === "subregion"),
    },
  ];

  const [activeSection, setActiveSection] = useState<
    "all" | "people" | "countries" | "currencies" | "regions" | "subregions"
  >("all");

  return (
    <Container className="mt-12">
      {loading ? (
        <EmptyListMessage message={t("search.searching")} />
      ) : queryParam ? (
        results.length === 0 ? (
          <EmptyListMessage message={t("search.noResults")} />
        ) : (
          <>
            <SegmentedToggle
              value={activeSection}
              onChange={setActiveSection}
              options={[
                { value: "all", label: t("search.sections.all") },
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
    </Container>
  );
}
