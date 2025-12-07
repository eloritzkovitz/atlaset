import { getSovereigntyInfoForTerritory } from "@features/countries";
import type { Country } from "@types";
import { SovereigntyBadge } from "./SovereigntyBadge";
import { CountryInfoTable } from "./CountryInfoTable";
import { CountryFlag } from "../countryFlag/CountryFlag";

interface CountryDetailsContentProps {
  country: Country;
  currencies: any;
}

export function CountryDetailsContent({
  country,
  currencies,
}: CountryDetailsContentProps) {
  const sovereigntyInfo = getSovereigntyInfoForTerritory(country.isoCode);

  return (
    <div>
      {country.sovereigntyType && sovereigntyInfo && (
        <SovereigntyBadge
          type={country.sovereigntyType}
          sovereign={sovereigntyInfo.sovereign}
        />
      )}
      <CountryFlag
        flag={{
          isoCode: country.isoCode,
          source: "flagcdn",
          style: "flat",
          size: "128",
        }}
        alt={`${country.name} flag`}
        className="block mx-auto mb-4 h-32 w-auto"
      />
      <CountryInfoTable country={country} currencies={currencies} />
    </div>
  );
}
