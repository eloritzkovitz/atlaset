import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const { handleCountrySelect, handleBack } = useDashboardNavigation(
    countries,
    "",
    "",
  );
  const [expandedSovereign, setExpandedSovereign] = useState(true);
  const [expandedDependencies, setExpandedDependencies] = useState(true);

  // Split countries using this currency into sovereign and dependency lists
  const { sovereignIsoCodes, dependencyIsoCodes } = useMemo(() => {
    const sov: string[] = [];
    const dep: string[] = [];
    if (!currency) return { sovereignIsoCodes: sov, dependencyIsoCodes: dep };
    for (const c of countries) {
      if (c.currency !== currency.code) continue;
      if (
        c.sovereigntyStatus === "sovereign" ||
        c.sovereigntyStatus === "partially_recognized"
      ) {
        sov.push(c.isoCode);
      } else {
        dep.push(c.isoCode);
      }
    }
    return { sovereignIsoCodes: sov, dependencyIsoCodes: dep };
  }, [countries, currency]);

  // Redirect if currency not found
  useEffect(() => {
    if (!currency) navigate("/dashboard/currencies");
  }, [currency, navigate]);
  if (!currency) return null;

  return (
    <section className="max-w-6xl mx-auto">
      <DashboardHeader
        title={currency.name}
        subtitle={`(${currency.code})`}
        onBack={handleBack}
      />
      {sovereignIsoCodes.length > 0 && (
        <CountryListGroup
          label={t("currencies.currencyInfo.usingCurrency", {
            code: currency.code,
            defaultValue: `Countries using ${currency.code}`,
          })}
          isoCodes={sovereignIsoCodes}
          countries={countries}
          expanded={expandedSovereign}
          onToggle={() => setExpandedSovereign((prev) => !prev)}
          onSelectCountry={handleCountrySelect}
        />
      )}
      {dependencyIsoCodes.length > 0 && (
        <CountryListGroup
          label={t("currencies.currencyInfo.dependenciesUsingCurrency", {
            code: currency.code,
            defaultValue: `Dependencies and territories using ${currency.code}`,
          })}
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
