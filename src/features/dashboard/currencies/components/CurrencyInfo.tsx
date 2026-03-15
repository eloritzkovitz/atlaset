import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  CountryListGroup,
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
  const [expandedSovereign, setExpandedSovereign] = useState(true);
  const [expandedDependencies, setExpandedDependencies] = useState(true);

  // Redirect if currency not found
  useEffect(() => {
    if (!currency) navigate("/dashboard/currencies");
  }, [currency, navigate]);
  if (!currency) return null;

  // Split countries
  const countriesUsing = countries.filter((c) => c.currency === currency.code);
  const sovereignIsoCodes = countriesUsing
    .filter((c) => c.sovereigntyType === "Sovereign")
    .map((c) => c.isoCode);
  const dependencyIsoCodes = countriesUsing
    .filter((c) => c.sovereigntyType !== "Sovereign")
    .map((c) => c.isoCode);

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
      {sovereignIsoCodes.length > 0 && (
        <CountryListGroup
          label={`Countries using ${currency.code}`}
          isoCodes={sovereignIsoCodes}
          countries={countries}
          expanded={expandedSovereign}
          onToggle={() => setExpandedSovereign((prev) => !prev)}
          onSelectCountry={handleCountrySelect}
        />
      )}
      {dependencyIsoCodes.length > 0 && (
        <CountryListGroup
          label={`Dependencies and territories using ${currency.code}`}
          isoCodes={dependencyIsoCodes}
          countries={countries}
          expanded={expandedDependencies}
          onToggle={() => setExpandedDependencies((prev) => !prev)}
          onSelectCountry={handleCountrySelect}
        />
      )}
    </section>
  );
};
