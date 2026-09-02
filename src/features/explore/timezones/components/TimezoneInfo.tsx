import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { groupCountryIsoCodes } from "@features/countries";
import type { Country, Timezone } from "@features/countries/types";
import { getQueryParam, normalizeTzCode } from "@utils";
import { InfoWithCountryGroups } from "../../core/components/InfoWithCountryGroups";
import { WikipediaButton } from "../../core/components/WikipediaButton";
import { EXPLORE_URLS } from "../../core/constants/exploreMenu";
import { useExploreNavigation } from "../../core/hooks/useExploreNavigation";

interface TimezoneInfoProps {
  timezones: Timezone[];
  countries: Country[];
}

export const TimezoneInfo: React.FC<TimezoneInfoProps> = ({
  timezones,
  countries,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { code: routeCode } = useParams<{ code?: string }>();

  const code = useMemo(() => {
    const raw = routeCode || getQueryParam("code", "", location.search);
    return raw ? decodeURIComponent(raw) : "";
  }, [routeCode, location.search]);

  const timezone = useMemo(
    () =>
      timezones.find(
        (tz) => normalizeTzCode(tz.code) === normalizeTzCode(code),
      ),
    [timezones, code],
  );

  const { navigateToCountry, navigateBack } = useExploreNavigation(countries);

  const standardCountryIsoCodes = useMemo(
    () =>
      new Set(
        timezone?.countries
          .filter((country) => !country.isDst)
          .map((country) => country.isoCode) ?? [],
      ),
    [timezone],
  );

  const dstCountryIsoCodes = useMemo(
    () =>
      new Set(
        timezone?.countries
          .filter((country) => country.isDst)
          .map((country) => country.isoCode) ?? [],
      ),
    [timezone],
  );

  const standardIsoGroups = useMemo(
    () =>
      groupCountryIsoCodes(countries, (country) =>
        standardCountryIsoCodes.has(country.isoCode),
      ),
    [countries, standardCountryIsoCodes],
  );

  const dstIsoGroups = useMemo(
    () =>
      groupCountryIsoCodes(countries, (country) =>
        dstCountryIsoCodes.has(country.isoCode),
      ),
    [countries, dstCountryIsoCodes],
  );

  useEffect(() => {
    if (!timezone && timezones.length > 0) {
      navigate("/explore/timezones", { replace: true });
    }
  }, [timezone, timezones, navigate]);

  if (!timezone) return null;

  return (
    <InfoWithCountryGroups
      title={timezone.code}
      actions={<WikipediaButton searchTerm={`${timezone.code}`} />}
      onBack={() => navigateBack(EXPLORE_URLS.timezones)}
      labelArgs={{ code: timezone.code }}
      onSelectCountry={(isoCode, navigationCountryIsoCodes) =>
        navigateToCountry(isoCode, navigationCountryIsoCodes, {
          section: "timezones",
          label: timezone.code,
          key: `timezone:${timezone.code}`,
        })
      }
      groups={[
        {
          isoCodes: standardIsoGroups.sovereignIsoCodes,
          navigationCountryIsoCodes: standardIsoGroups.sovereignIsoCodes,
          labelKey: "timezones.timezoneInfo.usingStandardTime",
        },
        {
          isoCodes: standardIsoGroups.dependencyIsoCodes,
          navigationCountryIsoCodes: standardIsoGroups.dependencyIsoCodes,
          labelKey: "timezones.timezoneInfo.dependenciesUsingStandardTime",
        },
        {
          isoCodes: dstIsoGroups.sovereignIsoCodes,
          navigationCountryIsoCodes: dstIsoGroups.sovereignIsoCodes,
          labelKey: "timezones.timezoneInfo.usingDST",
        },
        {
          isoCodes: dstIsoGroups.dependencyIsoCodes,
          navigationCountryIsoCodes: dstIsoGroups.dependencyIsoCodes,
          labelKey: "timezones.timezoneInfo.dependenciesUsingDST",
        },
      ]}
    />
  );
};
