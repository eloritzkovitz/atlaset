import { CountryWithFlag } from "@features/countries";
import type { SovereigntyType } from "@types";

interface SovereigntyBadgeProps {
  type?: SovereigntyType;
  sovereign?: { name: string; isoCode?: string };
};

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

export function SovereigntyBadge({ type, sovereign }: SovereigntyBadgeProps) {
  if (!type) return null;

  const color = badgeColors[type] || badgeColors.Dependency;

  let label: React.ReactNode = type;

  if (
    sovereign &&
    sovereign.name &&
    labelPrefixes[type as keyof typeof labelPrefixes]
  ) {
    label = (
      <>
        {labelPrefixes[type as keyof typeof labelPrefixes]}
        {sovereign.isoCode ? (
          <CountryWithFlag
            isoCode={sovereign.isoCode}
            name={sovereign.name}
            className="mx-[3px] inline-block align-middle"
          />
        ) : (
          sovereign.name
        )}
      </>
    );
  }

  return (
    <div
      className={`mb-6 text-base text-center font-semibold rounded-full p-2 ${color}`}
    >
      {label}
    </div>
  );
}
