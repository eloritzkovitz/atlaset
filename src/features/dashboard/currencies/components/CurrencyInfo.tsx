import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Currency, type Country } from "@features/countries";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";
import { useIsoGroups } from "../../common/hooks/useIsoGroups";
import { InfoWithCountryGroups } from "../../common/components/InfoWithCountryGroups";
import { WikipediaButton } from "../../common/components/WikipediaButton";

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
  const isoGroups = useIsoGroups(countries, (c) =>
    currency ? c.currency === currency.code : false,
  );

  // Redirect if currency not found
  useEffect(() => {
    if (!currency) navigate("/dashboard/currencies");
  }, [currency, navigate]);
  if (!currency) return null;

  return (
    <InfoWithCountryGroups
      title={currency.name}
      subtitle={`(${currency.code})`}
      actions={<WikipediaButton searchTerm={`${currency.name}`} />}
      onBack={handleBack}
      isoGroups={isoGroups}
      primaryLabelKey="currencies.currencyInfo.usingCurrency"
      dependencyLabelKey="currencies.currencyInfo.dependenciesUsingCurrency"
      labelArgs={{ code: currency.code }}
      onSelectCountry={handleCountrySelect}
      countries={countries}
    />
  );
};
