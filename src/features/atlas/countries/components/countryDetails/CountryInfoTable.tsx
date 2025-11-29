import type { Country } from "@types";
import { getLanguagesDisplay } from "@features/countries";

interface CountryInfoTableProps {
  country: Country;
  currencies: Record<string, string>;
};

export function CountryInfoTable({
  country,
  currencies,
}: CountryInfoTableProps) {
  return (
    <table className="w-full mb-4 text-gray-700 border-separate [border-spacing:0.5rem]">
      <tbody>
        <tr>
          <td className="font-semibold">Region:</td>
          <td>{country.region}</td>
        </tr>
        <tr>
          <td className="font-semibold">Subregion:</td>
          <td>{country.subregion}</td>
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
          <td>
            {country.currency && currencies[country.currency]
              ? `${currencies[country.currency]} (${country.currency})`
              : country.currency || "N/A"}
          </td>
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
          <td className="font-semibold">ISO 3166 Code:</td>
          <td>{country.isoCode}</td>
        </tr>
      </tbody>
    </table>
  );
}
