import { useTranslation } from "react-i18next";
import { useMemo, type ReactNode } from "react";
import { canonicalKey } from "@utils";
import type { Country, Currency } from "../../types";
import { getTranscontinentalInfo } from "../../utils/countryData";
import { useCountryData } from "../../hooks/useCountryData";
import {
  getAltNamesDisplay,
  getCurrencyDisplay,
  getLanguagesDisplay,
} from "../../utils/countryInfo";
import { formatTimezones } from "../../utils/timezoneData";

interface CountryInfoTableProps {
  country: Country;
  currencies: Currency[];
}

interface InfoRowProps {
  label: string;
  children: ReactNode;
}

/** Renders a single row in the country info table. */
function InfoRow({ label, children }: InfoRowProps) {
  if (children === undefined || children === null || children === "")
    return null;
  return (
    <tr>
      <td className="font-semibold ps-4 align-top">{label}</td>
      <td>{children}</td>
    </tr>
  );
}

/** Renders the timezones, handling single entries, array sets, and translations. */
function renderTimezones(tzs?: string[], t?: (k: string) => string) {
  const formatted = formatTimezones(tzs, t);
  if (Array.isArray(formatted)) {
    return (
      <div className="flex flex-col">
        {formatted.map((tz, index) => (
          <div key={index}>{tz}</div>
        ))}
      </div>
    );
  }
  return formatted || "—";
}

export function CountryInfoTable({
  country,
  currencies,
}: CountryInfoTableProps) {
  const { t } = useTranslation("atlas");
  const { t: tCountries } = useTranslation("countries");
  const { languages, subregionsByRegion } = useCountryData();

  const normalizeKey = (raw?: string) => canonicalKey(String(raw ?? ""));

  // Get transcontinental info if applicable, to display additional region/subregion info
  const trans = useMemo(() => {
    return getTranscontinentalInfo(
      country,
      subregionsByRegion as Record<string, string[]> | undefined,
    );
  }, [country, subregionsByRegion]);

  // Compute the display strings for region and subregion, including transcontinental info if applicable
  const regionDisplay = useMemo(() => {
    const primary = tCountries(`regions.${country.region}`, {
      defaultValue: country.region,
    });
    if (trans?.additionalRegion) {
      const additional = tCountries(`regions.${trans.additionalRegionKey}`, {
        defaultValue: trans.additionalRegion,
      });
      return `${primary} / ${additional}`;
    }
    return primary;
  }, [country.region, trans, tCountries]);
  const subregionDisplay = useMemo(() => {
    if (!country.subregion) return "—";
    const primary = tCountries(
      `subregions.${country.region}.${normalizeKey(country.subregion)}`,
      {
        defaultValue: country.subregion,
      },
    );
    if (trans?.additionalSubregion) {
      const additional = tCountries(
        `subregions.${trans.additionalSubregionRegion ?? country.region}.${trans.additionalSubregionKey}`,
        { defaultValue: trans.additionalSubregion },
      );
      return `${primary} / ${additional}`;
    }
    return primary;
  }, [country.subregion, country.region, trans, tCountries]);

  return (
    <table className="w-full border-separate [border-spacing:0_0.5rem]">
      <tbody>
        <InfoRow label={t("countries.details.overview.region")}>
          {regionDisplay}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.subregion")}>
          {subregionDisplay}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.capital")}>
          {country.capital || t("countries.details.overview.none", "None")}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.languages")}>
          {getLanguagesDisplay(country.languages, languages) || "—"}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.government")}>
          {country.government
            ? tCountries(`governmentType.${country.government}`, {
                defaultValue: String(country.government),
              })
            : "—"}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.area")}>
          {country.area
            ? `${country.area.toLocaleString()} ${t("countries.details.overview.areaUnit")}`
            : "—"}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.population")}>
          {country.population?.toLocaleString() ?? "—"}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.currency")}>
          {getCurrencyDisplay(country.currency, currencies) || "—"}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.timezone")}>
          {renderTimezones(country.timezones, t)}
        </InfoRow>

        <InfoRow label={t("countries.details.overview.callingCode")}>
          <span dir="ltr">{country.callingCode || "—"}</span>
        </InfoRow>

        {country.drivingSide && (
          <InfoRow label={t("countries.details.overview.drivingSide")}>
            {tCountries(`drivingSide.${country.drivingSide}`, {
              defaultValue: country.drivingSide,
            })}
          </InfoRow>
        )}

        <InfoRow label={t("countries.details.overview.isoCode")}>
          {country.isoCode || "—"}
        </InfoRow>

        {country.altNames && country.altNames.length > 0 && (
          <InfoRow label={t("countries.details.overview.altNames")}>
            {getAltNamesDisplay(country.altNames)}
          </InfoRow>
        )}
      </tbody>
    </table>
  );
}
