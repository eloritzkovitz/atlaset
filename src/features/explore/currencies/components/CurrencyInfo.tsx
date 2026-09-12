import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WikipediaButton } from "@components";
import { groupCountryIsoCodes } from "@features/countries";
import { type Country, type Currency } from "@features/countries/types";
import { useLanguage } from "@features/settings/account/hooks/useLanguage";
import { getQueryParam } from "@utils";
import { InfoWithCountryGroups } from "../../core/components/InfoWithCountryGroups";
import { EXPLORE_URLS } from "../../core/constants/exploreMenu";
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

  const { current: lang } = useLanguage();

  // Resolve code via route param or fallback query string
  const code = routeCode || getQueryParam("code", "", location.search);
  const currency = currencies.find((c) => c.code === code);

  const isoGroups = groupCountryIsoCodes(
    countries,
    (country) => currency?.code === country.currency,
  );

  const { navigateToCountry, navigateBack } = useExploreNavigation(countries);

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
      actions={<WikipediaButton searchTerm={`${currency.name}`} lang={lang} />}
      onBack={() => navigateBack(EXPLORE_URLS.currencies)}
      labelArgs={{ code: currency.code }}
      onSelectCountry={(isoCode, navigationCountryIsoCodes) =>
        navigateToCountry(isoCode, navigationCountryIsoCodes, {
          section: "currencies",
          label: `${currency.name} (${currency.code})`,
          key: `currency:${currency.code}`,
        })
      }
      groups={[
        {
          isoCodes: isoGroups.sovereignIsoCodes,
          labelKey: "currencies.currencyInfo.usingCurrency",
        },
        {
          isoCodes: isoGroups.dependencyIsoCodes,
          labelKey: "currencies.currencyInfo.dependenciesUsingCurrency",
        },
      ]}
    />
  );
};
