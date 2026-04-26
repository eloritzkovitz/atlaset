import { CountryWithFlag } from "../../components/countryFlag/CountryWithFlag";
import { useCountryData } from "../../hooks/useCountryData";
import type { SovereigntyStatus } from "../../types";
import { getCountryName } from "../../utils/countryData";

interface SovereigntyBadgeProps {
  type?: SovereigntyStatus;
  sovereignState?: string;
  onSelectCountry?: (isoCode: string) => void;
}

// Map sovereignty types to badge colors
const badgeColors: Record<SovereigntyStatus, string> = {
  Sovereign: "bg-info-hover/70",
  Dependency: "bg-muted/70",
  "Overseas Region": "bg-success-hover/50",
  Unrecognized: "bg-danger-hover/70",
  Disputed: "bg-warning-hover/70",
  Unknown: "bg-muted-hover",
};

// Optional label prefixes for sovereignty types
const labelPrefixes: Partial<Record<SovereigntyStatus, string>> = {
  "Overseas Region": "Overseas Region of ",
  Disputed: "Disputed by ",
  Dependency: "Dependency of ",
};

export function SovereigntyBadge({
  type,
  sovereignState,
  onSelectCountry,
}: SovereigntyBadgeProps) {
  const { countries } = useCountryData();

  // If no type is provided, don't render anything
  if (!type) return null;

  // Determine badge color based on type, defaulting to Dependency style
  const color = badgeColors[type] || badgeColors.Dependency;
  let label: React.ReactNode = type;

  // Add sovereign name with flag for certain types
  if (sovereignState && labelPrefixes[type as keyof typeof labelPrefixes]) {
    const name = getCountryName(sovereignState, countries);
    label = (
      <>
        {labelPrefixes[type as keyof typeof labelPrefixes]}
        {onSelectCountry ? (
          <button
            type="button"
            className="mx-[3px] inline-block align-middle hover:text-info focus:outline-none"
            onClick={() => onSelectCountry(sovereignState)}
            tabIndex={0}
          >
            <CountryWithFlag isoCode={sovereignState} name={name} />
          </button>
        ) : (
          <CountryWithFlag
            isoCode={sovereignState}
            name={name}
            className="mx-[3px] inline-block align-middle"
          />
        )}
      </>
    );
  }

  return (
    <div
      className={`
        mb-4 sm:mb-6
        text-sm sm:text-base
        text-center font-semibold
        rounded-full
        p-2 sm:px-4 sm:py-2
        break-words select-none
        ${color}
      `}
    >
      {label}
    </div>
  );
}
