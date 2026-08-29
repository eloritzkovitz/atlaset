import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCountryData, useGetCountryFactsQuery } from "@features/countries";
import { useDelayedLoading } from "@hooks";
import { DiscoverCountryCard } from "./DiscoverCountryCard";
import { DiscoverRandomCountryCard } from "./DiscoverRandomCountryCard";
import { DiscoverFactCard } from "./DiscoverFactCard";
import { getDailyCountry } from "../utils/discover";

/**
 * Displays the main Discover content.
 */
export function ExploreDiscoverGrid() {
  const { countries, loading: countriesLoading } = useCountryData();
  const { data: facts = [], isLoading: factsLoading } =
    useGetCountryFactsQuery();

  const { t } = useTranslation("explore");

  const loading = useDelayedLoading(
    countriesLoading || !countries.length || factsLoading,
    [countries.length, factsLoading],
    50,
  );

  const dailyCountry = useMemo(() => getDailyCountry(countries), [countries]);

  const randomFacts = useMemo(() => {
    if (!facts.length) {
      return [];
    }

    return [...facts].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [facts]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {t("menu.discover", "Discover")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DiscoverCountryCard
            title={t("discover.countryOfTheDay.title", "Country of the Day")}
            country={dailyCountry}
            loading={loading}
          />

          <DiscoverRandomCountryCard countries={countries} loading={loading} />

          <div className="lg:col-span-2">
            <DiscoverFactCard facts={randomFacts} loading={loading} />
          </div>
        </div>
      </section>
    </div>
  );
}
