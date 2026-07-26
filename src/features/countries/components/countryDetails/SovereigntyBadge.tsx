import { useTranslation } from "react-i18next";
import { CountryWithFlag } from "../../components/countryFlag/CountryWithFlag";
import { useCountryData } from "../../hooks/useCountryData";
import type { NonSovereignStatus, SovereigntyStatus } from "../../types";
import { getCountryName } from "../../utils/countryData";

interface SovereigntyBadgeProps {
  type?: SovereigntyStatus;
  sovereignState?: string;
  onSelectCountry?: (isoCode: string) => void;
}

// Map sovereignty types to badge colors
const badgeColors: Record<SovereigntyStatus, string> = {
  sovereign: "bg-primary/50",
  dependency: "bg-info/50",
  overseas_region: "bg-info/30",
  special_territory: "bg-info/20",
  partially_recognized: "bg-warning/50",
  unrecognized: "bg-danger/50",
  disputed: "bg-warning/50",
  unknown: "bg-muted/50",
};

const PREFIX_TYPES = new Set<NonSovereignStatus>([
  "dependency",  
  "overseas_region",
  "special_territory",
  "partially_recognized",
  "disputed",
]);

export function SovereigntyBadge({
  type,
  sovereignState,
  onSelectCountry,
}: SovereigntyBadgeProps) {
  const { countries } = useCountryData();
  const { t } = useTranslation("countries");

  // If no type is provided, don't render anything
  if (!type) return null;

  const color = badgeColors[type] || badgeColors.dependency;
  const translated = t(`sovereignty.${type}`, { defaultValue: type });

  const prefix = t(`sovereigntyPrefixes.${type}`, {
    defaultValue: translated,
  });

  if (sovereignState) {
    const name = getCountryName(sovereignState, countries);
    const flag = onSelectCountry ? (
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
    );

    return (
      <div
        className={`mb-4 sm:mb-6 text-sm sm:text-base text-center font-semibold rounded-full p-2 sm:px-4 sm:py-2 break-words select-none ${color}`}
      >
        {PREFIX_TYPES.has(type as NonSovereignStatus) ? (
          <>
            {prefix} {flag}
          </>
        ) : (
          flag
        )}
      </div>
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
      {translated}
    </div>
  );
}
