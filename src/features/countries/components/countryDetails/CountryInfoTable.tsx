import { useTranslation } from "react-i18next";
import { canonicalKey } from "@utils/string";
import type { Country, Currency } from "../../types";
import { getTranscontinentalInfo } from "../../utils/countryData";
import { useCountryData } from "../../hooks/useCountryData";
import {
  formatTimezones,
  getAltNamesDisplay,
  getCurrencyDisplay,
  getLanguagesDisplay,
} from "../../utils/countryInfo";

interface CountryInfoTableProps {
  country: Country;
  currencies: Currency[];
}

// Renders the timezones for a country, handling multiple timezones and DST if applicable.
function renderTimezones(tzs?: string[], t?: (k: string) => string) {
  const formatted = formatTimezones(tzs, t);
  if (Array.isArray(formatted)) {
    return (
      <div className="flex flex-col">
        <div>{formatted[0]}</div>
        <div>{formatted[1]}</div>
      </div>
    );
  }
  return formatted;
}

export function CountryInfoTable({
  country,
  currencies,
}: CountryInfoTableProps) {
  const { t } = useTranslation("atlas");
  const { t: tCountries } = useTranslation("countries");
  const { subregionsByRegion } = useCountryData();
  const normalizeKey = (raw?: string) => canonicalKey(String(raw ?? ""));

  // Handle transcontinental countries info
  const trans = getTranscontinentalInfo(
    country,
    subregionsByRegion as Record<string, string[]> | undefined,
  );
  const additionalRegion = trans?.additionalRegion;
  const additionalRegionKey = trans?.additionalRegionKey;
  const additionalSubregion = trans?.additionalSubregion;
  const additionalSubregionKey = trans?.additionalSubregionKey;
  const additionalSubregionRegion = trans?.additionalSubregionRegion;

  return (
    <table className="w-full border-separate [border-spacing:0.5rem]">
      <tbody>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.region")}
          </td>
          <td>
            {tCountries(`regions.${country.region}`, {
              defaultValue: country.region,
            })}
            {additionalRegion && (
              <span>
                {" "}
                /{" "}
                {tCountries(`regions.${additionalRegionKey}`, {
                  defaultValue: additionalRegion,
                })}
              </span>
            )}
          </td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.subregion")}
          </td>
          <td>
            {country.subregion
              ? tCountries(
                  `subregions.${country.region}.${normalizeKey(country.subregion)}`,
                  { defaultValue: country.subregion },
                )
              : "—"}
            {additionalSubregion && (
              <span>
                {" "}
                /{" "}
                {tCountries(
                  `subregions.${additionalSubregionRegion ?? country.region}.${additionalSubregionKey}`,
                  { defaultValue: additionalSubregion },
                )}
              </span>
            )}
          </td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.capital")}
          </td>
          <td>
            {country.capital || t("countries.details.overview.none", "None")}
          </td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.languages")}
          </td>
          <td>{getLanguagesDisplay(country.languages)}</td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.government")}
          </td>
          <td>{country.government || "—"}</td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.area")}
          </td>
          <td>
            {country.area?.toLocaleString()}{" "}
            {t("countries.details.overview.areaUnit")}
          </td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.population")}
          </td>
          <td>{country.population?.toLocaleString()}</td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.currency")}
          </td>
          <td>{getCurrencyDisplay(country.currency, currencies)}</td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.timezone")}
          </td>
          <td>{renderTimezones(country.timezones, t)}</td>
        </tr>
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.callingCode")}
          </td>
          <td>
            <span dir="ltr">{country.callingCode || "—"}</span>
          </td>
        </tr>
        {country.drivingSide && (
          <tr>
            <td className="font-semibold">
              {t("countries.details.overview.drivingSide")}
            </td>
            <td>
              {country.drivingSide
                ? tCountries(`drivingSide.${country.drivingSide}`, {
                    defaultValue: country.drivingSide,
                  })
                : "—"}
            </td>
          </tr>
        )}
        <tr>
          <td className="font-semibold">
            {t("countries.details.overview.isoCode")}
          </td>
          <td>{country.isoCode}</td>
        </tr>
        {country.altNames && country.altNames.length > 0 && (
          <tr>
            <td className="font-semibold">
              {t("countries.details.overview.altNames")}
            </td>
            <td>{getAltNamesDisplay(country.altNames)}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
