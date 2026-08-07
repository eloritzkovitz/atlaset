import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Container, EmptyListMessage, SegmentedToggle } from "@components";
import { useCountryData } from "@features/countries";
import { useAuth } from "@features/user/auth";
import { useUserFriends } from "@features/user/friends";
import { usePageTitle } from "@hooks";
import { getQueryParam } from "@utils";
import { SearchSection } from "../components/results/SearchSection";
import { useSearch } from "../hooks/useSearch";

export default function SearchPage() {
  const { user: currentUser } = useAuth();
  const { countries } = useCountryData();
  const location = useLocation();
  const { t } = useTranslation("common");
  const { friends: friendList } = useUserFriends(currentUser?.uid);

  const queryParam = getQueryParam("query", location.search);
  const { results, loading } = useSearch(queryParam);

  usePageTitle(
    queryParam
      ? t("components.search.pageTitle", { query: queryParam })
      : undefined,
  );

  const sections = [
    {
      key: "people" as const,
      title: t("domain.categories.people"),
      items: results.filter((item) => item.type === "user"),
    },
    {
      key: "countries" as const,
      title: t("domain.categories.countries"),
      items: results.filter((item) => item.type === "country"),
    },
    {
      key: "currencies" as const,
      title: t("domain.categories.currencies"),
      items: results.filter((item) => item.type === "currency"),
    },
    {
      key: "regions" as const,
      title: t("domain.categories.regions"),
      items: results.filter((item) => item.type === "region"),
    },
    {
      key: "subregions" as const,
      title: t("domain.categories.subregions"),
      items: results.filter((item) => item.type === "subregion"),
    },
  ];

  const [activeSection, setActiveSection] = useState<
    "all" | "people" | "countries" | "currencies" | "regions" | "subregions"
  >("all");

  return (
    <Container className="mt-12">
      {loading ? (
        <EmptyListMessage message={t("components.search.searching")} />
      ) : queryParam ? (
        results.length === 0 ? (
          <EmptyListMessage message={t("components.search.noResults")} />
        ) : (
          <>
            <SegmentedToggle
              value={activeSection}
              onChange={setActiveSection}
              options={[
                { value: "all", label: t("domain.categories.all") },
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
