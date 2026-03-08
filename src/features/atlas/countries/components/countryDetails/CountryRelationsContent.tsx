import { useMemo, useState } from "react";
import { CollapsibleHeader, EmptyListMessage } from "@components";
import {
  CountryWithFlag,
  sortCountries,
  type Country,
} from "@features/countries";
import { SOVEREIGN_DEPENDENCIES } from "@features/countries/constants/sovereignDependencies";

interface CountryRelationsContentProps {
  country: Country;
}

export function CountryRelationsContent({
  country,
}: CountryRelationsContentProps) {
  const group = SOVEREIGN_DEPENDENCIES[country.isoCode];
  if (!group) {
    return (
      <EmptyListMessage message="No dependencies or disputes for this country." />
    );
  }

  // Prepare sections with sorted countries
  const sections = useMemo(
    () => [
      {
        key: "countries",
        label: "Countries",
        data: sortCountries(
          (group.countries as Country[]) || [],
          "name-asc",
          [],
        ),
      },
      {
        key: "dependencies",
        label: "Dependencies",
        data: sortCountries(
          (group.dependencies as Country[]) || [],
          "name-asc",
          [],
        ),
      },
      {
        key: "regions",
        label: "Regions",
        data: sortCountries((group.regions as Country[]) || [], "name-asc", []),
      },
      {
        key: "disputes",
        label: "Disputes",
        data: sortCountries(
          (group.disputes as Country[]) || [],
          "name-asc",
          [],
        ),
      },
    ],
    [group],
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
                {section.data.map((item) => (
                  <CountryWithFlag
                    key={item.isoCode}
                    isoCode={item.isoCode}
                    name={item.name}
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
