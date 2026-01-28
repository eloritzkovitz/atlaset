import { CountryFlag } from "./CountryFlag";
import type { FlagSize } from "../../types/flag";

interface CountryWithFlagProps {
  isoCode: string;
  name: string;
  size?: FlagSize;
  className?: string;
}

export function CountryWithFlag({
  isoCode,
  name,
  size,
  className = "",
}: CountryWithFlagProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <CountryFlag
        flag={{
          isoCode,
          ratio: "3x2",
          size,
        }}
        className="flex-shrink-0"
      />
      <span className="ml-2">{name}</span>
    </span>
  );
}
