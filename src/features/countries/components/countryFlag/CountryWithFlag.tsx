import { CountryFlag } from "./CountryFlag";
import type { FlagSize } from "../../types/flag";

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
  const flagClass = `flex-shrink-0${visited ? "" : " grayscale opacity-60"}`;

  return (
    <span className={`inline-flex items-center ${className}`}>
      <CountryFlag
        flag={{
          isoCode,
          ratio: "3x2",
          size,
        }}
        className={flagClass}
      />
      <span className="ml-2">{name}</span>
    </span>
  );
}
