import { CountryInfoTable } from "./CountryInfoTable";
import { SovereigntyBadge } from "./SovereigntyBadge";
import { CountryFlag } from "../countryFlag/CountryFlag";
import type { Country, Currency } from "../../types";

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
  return (
    <div>
      {country.sovereigntyStatus && (
        <SovereigntyBadge
          type={country.sovereigntyStatus}
          sovereignState={country.sovereignState}
          onSelectCountry={onSelectCountry}
        />
      )}
      <CountryFlag
        flag={{
          isoCode: country.isoCode,
          sovereignState: country.sovereignState,
          ratio: "original",
          size: "256",
        }}
        className="block mx-auto mb-4 h-32 w-auto"
      />
      <CountryInfoTable country={country} currencies={currencies} />
    </div>
  );
}
