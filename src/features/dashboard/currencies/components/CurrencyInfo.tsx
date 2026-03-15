import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { EmptyListMessage, MenuButton, CollapsibleHeader } from "@components";
import {
  CountryWithFlag,
  type Currency,
  type Country,
} from "@features/countries";
import { useScreenSize } from "@hooks";
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
  const { isMobile } = useScreenSize();

  // Collapsible header state
  const [expanded, setExpanded] = useState(true);
  const handleToggle = () => setExpanded((prev) => !prev);

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

  // Country click handler
  const handleCountryClick = (country: Country) => {
    handleCountrySelect(country.isoCode);
  };

  return (
    <section className="max-w-6xl mx-auto p-4">
      <span className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 hover:text-muted"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className={`!text-${isMobile ? "2xl" : "4xl mb-4"} font-bold`}>
          {currency.name}
        </h1>
        <span className={`text-${isMobile ? "sm" : "2xl mb-2"} text-muted`}>
          ({currency.code})
        </span>
      </span>
      <CollapsibleHeader
        label={`Countries using ${currency.code} (${countriesUsing.length})`}
        expanded={expanded}
        icon={undefined}
        onToggle={handleToggle}
      >
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
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                />
              </MenuButton>
            ))}
          </div>
        )}
      </CollapsibleHeader>
    </section>
  );
};
