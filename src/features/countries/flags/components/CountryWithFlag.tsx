import { CountryFlag } from "./CountryFlag";
import type { FlagSize } from "../types";

interface CountryWithFlagProps {
  country: {
    isoCode: string;
    name: string;
    sovereignState?: string;
  };
  size?: FlagSize;
  className?: string;
  visited?: boolean;
}

export function CountryWithFlag({
  country,
  size,
  className = "",
  visited = true,
}: CountryWithFlagProps) {
  const flagClass = `flex-shrink-0${visited ? "" : " grayscale opacity-60"}`;

  return (
    <span className={`inline-flex items-center ${className}`}>
      <CountryFlag
        flag={{
          isoCode: country?.isoCode,
          sovereignState: country?.sovereignState,
          ratio: "3x2",
          size,
        }}
        className={flagClass}
      />
      <span className="ms-2 text-start">{country?.name}</span>
    </span>
  );
}
