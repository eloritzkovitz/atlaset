import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CountryListGroup,
  type Currency,
  type Country,
} from "@features/countries";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";
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
  const { handleCountrySelect, handleBack } = useDashboardNavigation(
    countries,
    "",
    "",
  );
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
    <section className="max-w-6xl mx-auto">
      <DashboardHeader
        title={currency.name}
        subtitle={`(${currency.code})`}
        onBack={handleBack}
      />
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
