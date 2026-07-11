import { CountryFlag } from "./CountryFlag";
import type { FlagSize } from "../../types/flag";
import { useCountryData } from "../../hooks/useCountryData";

interface CountryWithFlagProps {
  isoCode: string;
  name: string;
  size?: FlagSize;
  className?: string;
  visited?: boolean;
}

export function CountryWithFlag({
  isoCode,
  name,
  size,
  className = "",
  visited = true,
}: CountryWithFlagProps) {
  const { countries } = useCountryData();
  const country = countries.find((c) => c.isoCode === isoCode);
  const flagClass = `flex-shrink-0${visited ? "" : " grayscale opacity-60"}`;

  return (
    <span className={`inline-flex items-center ${className}`}>
      <CountryFlag
        flag={{
          isoCode,
          sovereignState: country?.sovereignState,
          ratio: "3x2",
          size,
        }}
        className={flagClass}
      />
      <span className="ms-2 text-start">{name}</span>
    </span>
  );
}
