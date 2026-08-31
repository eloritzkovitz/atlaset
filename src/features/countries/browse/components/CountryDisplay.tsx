import { CountryFlag } from "../../flags/components/CountryFlag";
import type { FlagRatio, FlagSize } from "../../flags/types";
import type { Country } from "../../types";

interface CountryDisplayProps {
  country: Country;
  flagRatio?: FlagRatio;
  flagSize?: FlagSize;
  showName?: boolean;
  hoverable?: boolean;
  className?: string;
}

/** Displays a country with a flag and an optional name. */
export function CountryDisplay({
  country,
  flagRatio = "original",
  flagSize = "64",
  showName = true,
  hoverable = false,
  className = "",
}: CountryDisplayProps) {
  return (
    <div
      className={`flex flex-col items-center w-[128px] h-[140px] ${className}`}
    >
      <div className="flex items-center justify-center w-full h-20">
        <CountryFlag
          flag={{
            isoCode: country.isoCode,
            sovereignState: country.sovereignState,
            ratio: flagRatio,
            size: flagSize,
          }}
          className={`max-w-full max-h-[96px] object-contain transition-transform duration-200 ${hoverable ? "group-hover:scale-110" : ""}`}
        />
      </div>

      <div className="w-full flex items-end justify-center mt-4">
        {showName && (
          <span className="w-full block text-center break-words min-h-[20px]">
            {country.name}
          </span>
        )}
      </div>
    </div>
  );
}
