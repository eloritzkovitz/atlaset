import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { groupCountryIsoCodes } from "@features/countries";
import { type Country, type Currency } from "@features/countries/types";
import { getQueryParam } from "@utils";
import { InfoWithCountryGroups } from "../../core/components/InfoWithCountryGroups";
import { WikipediaButton } from "../../core/components/WikipediaButton";
import { useExploreNavigation } from "../../core/hooks/useExploreNavigation";

interface CurrencyInfoProps {
  currencies: Currency[];
  countries: Country[];
}

export const CurrencyInfo: React.FC<CurrencyInfoProps> = ({
  currencies,
  countries,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { code: routeCode } = useParams<{ code?: string }>();

  // Resolve code via route param or fallback query string
  const code = routeCode || getQueryParam("code", "", location.search);
  const currency = currencies.find((c) => c.code === code);

  const { handleCountrySelect, handleBack } = useExploreNavigation(
    countries,
    "",
    "",
  );

  const isoGroups = groupCountryIsoCodes(
    countries,
    (country) => currency?.code === country.currency,
  );

  // Redirect to currencies list if currency not found
  useEffect(() => {
    if (!currency && currencies.length > 0) {
      navigate("/explore/currencies", { replace: true });
    }
  }, [currency, currencies, navigate]);

  if (!currency) return null;

  return (
    <InfoWithCountryGroups
      title={currency.name}
      subtitle={`(${currency.code})`}
      actions={<WikipediaButton searchTerm={`${currency.name}`} />}
      onBack={handleBack}
      labelArgs={{ code: currency.code }}
      onSelectCountry={handleCountrySelect}
      groups={[
        {
          isoGroups,
          primaryLabelKey: "currencies.currencyInfo.usingCurrency",
          dependencyLabelKey:
            "currencies.currencyInfo.dependenciesUsingCurrency",
        },
      ]}
    />
  );
};
