import type { Country, Currency } from "../../types";
import {
  getAliasesDisplay,
  getCurrencyDisplay,
  getLanguagesDisplay,
  isTranscontinental,
  getAdditionalRegion,
  getAdditionalSubregion,
} from "../../utils/countryData";

interface CountryInfoTableProps {
  country: Country;
  currencies: Currency[];
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
            {country.subregion}
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
          <td>{country.capital}</td>
        </tr>
        <tr>
          <td className="font-semibold">Currency:</td>
          <td>{getCurrencyDisplay(country.currency, currencies)}</td>
        </tr>
        <tr>
          <td className="font-semibold">Languages:</td>
          <td>{getLanguagesDisplay(country.languages)}</td>
        </tr>
        <tr>
          <td className="font-semibold">Calling code:</td>
          <td>{country.callingCode}</td>
        </tr>
        <tr>
          <td className="font-semibold">ISO 3166-1 Code:</td>
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
