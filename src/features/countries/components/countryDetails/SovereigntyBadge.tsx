import { useTranslation } from "react-i18next";
import { CountryWithFlag } from "../../components/countryFlag/CountryWithFlag";
import { SOVEREIGNTY_KEYS } from "../../constants/localeKeys";
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

const PREFIX_TYPES = new Set<SovereigntyStatus>([
  "Overseas Region",
  "Disputed",
  "Dependency",
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

  const color = badgeColors[type] || badgeColors.Dependency;
  const key = type ? SOVEREIGNTY_KEYS[type] : undefined;
  const translated = key
    ? t(`sovereignty.${key}`, { defaultValue: type })
    : type;

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
        {PREFIX_TYPES.has(type as SovereigntyStatus) ? (
          <>
            {translated}
            {flag}
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
