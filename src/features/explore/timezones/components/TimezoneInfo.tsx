import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { groupCountryIsoCodes } from "@features/countries";
import type { Country, Timezone } from "@features/countries/types";
import { getQueryParam, normalizeTzCode } from "@utils";
import { InfoWithCountryGroups } from "../../core/components/InfoWithCountryGroups";
import { WikipediaButton } from "../../core/components/WikipediaButton";
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

  // Determine the timezone code to display
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

  const { handleCountrySelect, handleBack } = useExploreNavigation(
    countries,
    "",
    "",
  );

  // Partition ISO codes into Standard Time vs DST sets
  const { standardIsoSet, dstIsoSet } = useMemo(() => {
    const standard = new Set<string>();
    const dst = new Set<string>();

    if (timezone?.countries) {
      for (const c of timezone.countries) {
        if (c.isDst) {
          dst.add(c.isoCode);
        } else {
          standard.add(c.isoCode);
        }
      }
    }

    return { standardIsoSet: standard, dstIsoSet: dst };
  }, [timezone]);

  // Standard Time IsoGroups (Sovereign & Dependencies)
  const standardIsoGroups = groupCountryIsoCodes(countries, (country) => {
    if (!timezone) return false;

    if (standardIsoSet.size > 0 || dstIsoSet.size > 0) {
      return standardIsoSet.has(country.isoCode);
    }

    const targetCode = normalizeTzCode(timezone.code);

    return (country.timezones ?? []).some(
      (tz) => normalizeTzCode(tz) === targetCode,
    );
  });

  // DST IsoGroups (Sovereign & Dependencies)
  const dstIsoGroups = groupCountryIsoCodes(
    countries,
    (country) => timezone != null && dstIsoSet.has(country.isoCode),
  );

  // Redirect if timezone not found
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
      onBack={handleBack}
      onSelectCountry={handleCountrySelect}
      labelArgs={{ code: timezone.code }}
      groups={[
        {
          isoGroups: standardIsoGroups,
          primaryLabelKey: "timezones.timezoneInfo.usingStandardTime",
          dependencyLabelKey:
            "timezones.timezoneInfo.dependenciesUsingStandardTime",
        },
        {
          isoGroups: dstIsoGroups,
          primaryLabelKey: "timezones.timezoneInfo.usingDST",
          dependencyLabelKey: "timezones.timezoneInfo.dependenciesUsingDST",
        },
      ]}
    />
  );
};
