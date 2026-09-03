import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCountryData, useGetCountryFactsQuery } from "@features/countries";
import { useDelayedLoading } from "@hooks";
import { DiscoverCountryCard } from "./DiscoverCountryCard";
import { DiscoverRandomCountryCard } from "./DiscoverRandomCountryCard";
import { DiscoverFactCard } from "./DiscoverFactCard";
import { getDailyCountry, getDailyFacts } from "../utils/discover";

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
  const dailyFacts = useMemo(() => getDailyFacts(facts), [facts]);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DiscoverCountryCard
            title={t("discover.countryOfTheDay.title", "Country of the Day")}
            country={dailyCountry}
            loading={loading}
          />

          <DiscoverRandomCountryCard countries={countries} loading={loading} />

          <div className="lg:col-span-2">
            <DiscoverFactCard facts={dailyFacts} loading={loading} />
          </div>
        </div>
      </section>
    </div>
  );
}
