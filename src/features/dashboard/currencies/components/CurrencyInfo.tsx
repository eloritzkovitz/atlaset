import React, { useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { EmptyListMessage, MenuButton } from "@components";
import {
  CountryWithFlag,
  type Currency,
  type Country,
} from "@features/countries";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";

interface CurrencyInfoProps {
  currency: Currency | undefined;
  countries: Country[];
}

export const CurrencyInfo: React.FC<CurrencyInfoProps> = ({
  currency,
  countries,
}) => {
  const navigate = useNavigate();
  const { handleCountrySelect } = useDashboardNavigation(countries, "", "");

  // If currency not found, redirect to currencies dashboard
  useEffect(() => {
    if (!currency) {
      navigate("/dashboard/currencies");
    }
  }, [currency, navigate]);

  // If currency is still undefined, render nothing
  if (!currency) {
    return null;
  }

  // Find countries that use this currency and sort them alphabetically
  const countriesUsing = countries
    .filter((c) => c.currency === currency.code)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Use centralized handler for country navigation
  const handleCountryClick = (country: Country) => {
    handleCountrySelect(country.isoCode);
  };

  return (
    <section className="max-w-6xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center focus:outline-none"
          aria-label="Go back"
        >
          <FaChevronLeft className="text-lg mr-1" />
          <h2 className="text-2xl font-bold">
            {currency.name}{" "}
            <span className="text-muted">({currency.code})</span>
          </h2>
        </button>
      </div>
      <h3 className="text-lg font-semibold mt-6 mb-2">
        Countries using {currency.code} ({countriesUsing.length}):
      </h3>
      {countriesUsing.length === 0 ? (
        <EmptyListMessage message="No countries use this currency." />
      ) : (
        <div className="flex flex-col space-y-2">
          {countriesUsing.map((country) => (
            <MenuButton
              key={country.isoCode}
              icon={undefined}
              onClick={() => handleCountryClick(country)}
              className="py-2 px-2"
            >
              <CountryWithFlag isoCode={country.isoCode} name={country.name} />
            </MenuButton>
          ))}
        </div>
      )}
    </section>
  );
};
