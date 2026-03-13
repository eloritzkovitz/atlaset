import { useMemo, useState } from "react";
import { CollapsibleHeader, EmptyListMessage, MenuButton } from "@components";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import {
  COUNTRY_RELATIONS,
  COUNTRY_RELATION_SECTIONS,
} from "../../constants/countryRelations";
import { useCountryData } from "../../hooks/useCountryData";
import { getCountryName } from "../../utils/countryData";

interface CountryRelationsContentProps {
  country: { isoCode: string };
  onSelectCountry?: (isoCode: string) => void;
}

export function CountryRelationsContent({
  country,
  onSelectCountry,
}: CountryRelationsContentProps) {
  const { countries } = useCountryData();
  const group =
    country && country.isoCode ? COUNTRY_RELATIONS[country.isoCode] : undefined;

  // Prepare sections with sorted isoCodes
  const sections = useMemo(() => {
    const sortByName = (arr: string[]) =>
      arr.slice().sort((a, b) => {
        const nameA = getCountryName(a, countries) || "";
        const nameB = getCountryName(b, countries) || "";
        return nameA.localeCompare(nameB);
      });
    return COUNTRY_RELATION_SECTIONS.map((def) => ({
      key: def.key,
      label: def.label,
      data: group ? sortByName(group[def.prop] || []) : [],
    }));
  }, [group, countries]);

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
    <div className="flex-1 overflow-y-auto">
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
                  <MenuButton
                    icon={undefined}
                    key={isoCode}
                    onClick={() => onSelectCountry && onSelectCountry(isoCode)}
                    className="py-2 px-2"
                  >
                    <CountryWithFlag
                      isoCode={isoCode}
                      name={getCountryName(isoCode, countries)}
                    />
                  </MenuButton>
                ))}
              </div>
            </CollapsibleHeader>
          ),
      )}
    </div>
  );
}
