import { useMemo, useState } from "react";
import { CollapsibleHeader, EmptyListMessage } from "@components";
import {
  COUNTRY_RELATIONS,
  COUNTRY_RELATION_SECTIONS,
  CountryWithFlag,
  getCountryName,
  useCountryData,
} from "@features/countries";

interface CountryRelationsContentProps {
  country: { isoCode: string };
}

export function CountryRelationsContent({
  country,
}: CountryRelationsContentProps) {
  const { countries } = useCountryData();
  const group = COUNTRY_RELATIONS[country.isoCode];

  // Helper to sort isoCodes by country name
  const sortByName = (arr: string[]) =>
    arr.slice().sort((a, b) => {
      const nameA = getCountryName(a, countries) || "";
      const nameB = getCountryName(b, countries) || "";
      return nameA.localeCompare(nameB);
    });

  // Prepare sections with sorted isoCodes
  const sections = useMemo(
    () =>
      COUNTRY_RELATION_SECTIONS.map((def) => ({
        key: def.key,
        label: def.label,
        data: sortByName(group[def.prop] || []),
      })),
    [group, countries, sortByName],
  );

  // Expanded state for each section
  const [expanded, setExpanded] = useState(() =>
    sections.reduce(
      (acc, s) => {
        acc[s.key] = !!s.data?.length;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  // Toggle handler
  const handleToggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // If no relations, show empty message
  if (!group) {
    return (
      <EmptyListMessage message="No dependencies or disputes for this country." />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto max-h-full">
      {sections.map(
        (section) =>
          section.data &&
          section.data.length > 0 && (
            <CollapsibleHeader
              key={section.key}
              icon={undefined}
              label={`${section.label} (${section.data.length})`}
              expanded={expanded[section.key]}
              onToggle={() => handleToggle(section.key)}
            >
              <div className="flex flex-col">
                {section.data.map((isoCode: string) => (
                  <CountryWithFlag
                    key={isoCode}
                    isoCode={isoCode}
                    name={getCountryName(isoCode, countries)}
                    className="py-2 px-2"
                  />
                ))}
              </div>
            </CollapsibleHeader>
          ),
      )}
    </div>
  );
}
