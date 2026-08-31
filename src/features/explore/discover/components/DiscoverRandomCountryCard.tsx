import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { getRandomCountry } from "@features/countries";
import type { Country } from "@features/countries/types";
import { DiscoverCountryCard } from "./DiscoverCountryCard";
import { ICONS } from "@constants/icons";

interface DiscoverRandomCountryCardProps {
  countries: Country[];
  loading?: boolean;
}

/** Displays an interactive random-country discovery card. */
export function DiscoverRandomCountryCard({
  countries,
  loading = false,
}: DiscoverRandomCountryCardProps) {
  const { t } = useTranslation("explore");

  const [selectedCountry, setSelectedCountry] = useState<Country>();

  // Randomize the country when the user clicks the button.
  const handleRandomize = () => {
    const nextCountry = getRandomCountry(countries);

    if (nextCountry) {
      setSelectedCountry(nextCountry);
    }
  };

  return (
    <DiscoverCountryCard
      title={t("discover.random.title", "Random Country")}
      country={selectedCountry}
      loading={loading}
      actions={
        selectedCountry && (
          <ActionButton
            icon={<ICONS.shuffle />}
            title={t("discover.random.randomize", "Randomize")}
            onClick={handleRandomize}
            rounded
          />
        )
      }
    >
      {!selectedCountry && (
        <>
          <div className="text-4xl mb-3">🎲</div>

          <div className="text-lg text-muted">
            {t("discover.random.description", "Find somewhere unexpected!")}
          </div>

          <ActionButton
            variant="primary"
            onClick={handleRandomize}
            className="mt-5"
          >
            {t("discover.random.surpriseMe", "Surprise Me!")}
          </ActionButton>
        </>
      )}
    </DiscoverCountryCard>
  );
}
