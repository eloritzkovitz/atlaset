import { CountryFlag } from "@features/countries/components/countryFlag/CountryFlag";
import { SovereigntyBadge } from "./SovereigntyBadge";
import { CountryInfoTable } from "./CountryInfoTable";
import { getSovereigntyInfoForTerritory } from "@features/countries";
import type { Country } from "@types";

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
          size: "64",
        }}
        alt={`${country.name} flag`}
        className="block mx-auto mb-4 h-16 w-auto"
      />
      <CountryInfoTable country={country} currencies={currencies} />
    </div>
  );
}
