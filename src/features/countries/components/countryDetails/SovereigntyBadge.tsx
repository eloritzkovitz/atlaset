import { CountryWithFlag } from "../../components/countryFlag/CountryWithFlag";
import { useCountryData } from "../../hooks/useCountryData";
import { getCountryName } from "../../utils/countryData";
import type { SovereigntyType } from "../../types";

interface SovereigntyBadgeProps {
  type?: SovereigntyType;
  sovereignIsoCode?: string;
  onSelectCountry?: (isoCode: string) => void;
}

// Map sovereignty types to badge colors
const badgeColors: Record<SovereigntyType, string> = {
  Sovereign: "bg-blue-300 text-gray-700 dark:bg-blue-700 dark:text-gray-100",
  Dependency: "bg-gray-300 text-gray-700 dark:bg-gray-500 dark:text-gray-100",
  "Overseas Region":
    "bg-green-300 text-gray-700 dark:bg-green-700 dark:text-gray-100",
  Unrecognized: "bg-red-300 text-gray-700 dark:bg-red-700 dark:text-gray-100",
  Disputed: "bg-yellow-300 text-gray-700 dark:bg-yellow-700 dark:text-gray-100",
  Unknown: "bg-gray-300 text-gray-700 dark:bg-gray-500 dark:text-gray-100",
};

// Optional label prefixes for sovereignty types
const labelPrefixes: Partial<Record<SovereigntyType, string>> = {
  "Overseas Region": "Overseas Region of ",
  Disputed: "Disputed by ",
  Dependency: "Dependency of ",
};

export function SovereigntyBadge({
  type,
  sovereignIsoCode,
  onSelectCountry,
}: SovereigntyBadgeProps) {
  const { countries } = useCountryData();

  // If no type is provided, don't render anything
  if (!type) return null;

  // Determine badge color based on type, defaulting to Dependency style
  const color = badgeColors[type] || badgeColors.Dependency;
  let label: React.ReactNode = type;

  // Add sovereign name with flag for certain types
  if (sovereignIsoCode && labelPrefixes[type as keyof typeof labelPrefixes]) {
    const name = getCountryName(sovereignIsoCode, countries);
    label = (
      <>
        {labelPrefixes[type as keyof typeof labelPrefixes]}
        {onSelectCountry ? (
          <button
            type="button"
            className="mx-[3px] inline-block align-middle hover:text-info focus:outline-none"
            onClick={() => onSelectCountry(sovereignIsoCode)}
            tabIndex={0}
          >
            <CountryWithFlag isoCode={sovereignIsoCode} name={name} />
          </button>
        ) : (
          <CountryWithFlag
            isoCode={sovereignIsoCode}
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
