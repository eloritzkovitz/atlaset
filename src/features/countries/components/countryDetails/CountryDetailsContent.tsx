import { SovereigntyBadge } from "./SovereigntyBadge";
import { CountryInfoTable } from "./CountryInfoTable";
import { CountryFlag } from "../countryFlag/CountryFlag";
import type { Country, Currency } from "../../types";
import { getCountryRelations } from "../../utils/countryData";

interface CountryDetailsContentProps {
  country: Country;
  currencies: Currency[];
  onSelectCountry?: (isoCode: string) => void;
}

export function CountryDetailsContent({
  country,
  currencies,
  onSelectCountry,
}: CountryDetailsContentProps) {
  const sovereigntyInfo = getCountryRelations(country.isoCode);

  return (
    <div>
      {country.sovereigntyType && sovereigntyInfo && (
        <SovereigntyBadge
          type={country.sovereigntyType}
          sovereignIsoCode={sovereigntyInfo.sovereign?.isoCode}
          onSelectCountry={onSelectCountry}
        />
      )}
      <CountryFlag
        flag={{
          isoCode: country.isoCode,
          ratio: "original",
          size: "256",
        }}
        className="block mx-auto mb-4 h-32 w-auto"
      />
      <CountryInfoTable country={country} currencies={currencies} />
    </div>
  );
}
