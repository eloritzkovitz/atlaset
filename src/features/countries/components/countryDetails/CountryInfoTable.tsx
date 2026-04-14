import type { Country, Currency } from "../../types";
import {
  isTranscontinental,
  getAdditionalRegion,
  getAdditionalSubregion,
} from "../../utils/countryData";
import {
  formatTimezones,
  getAliasesDisplay,
  getCurrencyDisplay,
  getLanguagesDisplay,
} from "../../utils/countryInfo";

interface CountryInfoTableProps {
  country: Country;
  currencies: Currency[];
}

// Renders the timezones for a country, handling multiple timezones and DST if applicable.
function renderTimezones(tzs?: string[]) {
  const formatted = formatTimezones(tzs);
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
  return (
    <table className="w-full border-separate [border-spacing:0.5rem]">
      <tbody>
        <tr>
          <td className="font-semibold">Region:</td>
          <td>
            {country.region}
            {isTranscontinental(country.isoCode) && (
              <span> / {getAdditionalRegion(country.isoCode)}</span>
            )}
          </td>
        </tr>
        <tr>
          <td className="font-semibold">Subregion:</td>
          <td>
            {country.subregion || "—"}
            {isTranscontinental(country.isoCode) &&
              getAdditionalSubregion(country.isoCode) && (
                <span> / {getAdditionalSubregion(country.isoCode)}</span>
              )}
          </td>
        </tr>
        <tr>
          <td className="font-semibold">Population:</td>
          <td>{country.population?.toLocaleString()}</td>
        </tr>
        <tr>
          <td className="font-semibold">Capital:</td>
          <td>{country.capital || "None"}</td>
        </tr>
        <tr>
          <td className="font-semibold">Languages:</td>
          <td>{getLanguagesDisplay(country.languages)}</td>
        </tr>
        <tr>
          <td className="font-semibold">Currency:</td>
          <td>{getCurrencyDisplay(country.currency, currencies)}</td>
        </tr>
        <tr>
          <td className="font-semibold">Time zone:</td>
          <td>{renderTimezones(country.timezones)}</td>
        </tr>
        <tr>
          <td className="font-semibold">Calling code:</td>
          <td>{country.callingCode || "—"}</td>
        </tr>
        {country.drivingSide && (
          <tr>
            <td className="font-semibold">Driving side:</td>
            <td>{country.drivingSide || "—"}</td>
          </tr>
        )}
        <tr>
          <td className="font-semibold">ISO 3166-1 code:</td>
          <td>{country.isoCode}</td>
        </tr>
        {country.aliases && country.aliases.length > 0 && (
          <tr>
            <td className="font-semibold">Also known as:</td>
            <td>{getAliasesDisplay(country.aliases)}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
