import { useMemo, useState } from "react";
import { CollapsibleHeader, EmptyListMessage, MenuButton } from "@components";

interface CountryAffiliationsContentProps {
  country: { isoCode: string; memberOf?: string[] };
}

export function CountryAffiliationsContent({
  country,
}: CountryAffiliationsContentProps) {
  const sections = useMemo(() => {
    if (!country) return [];

    const sections: { key: string; label: string; data: string[] }[] = [];

    if (country.memberOf && country.memberOf.length > 0) {
      sections.push({
        key: "memberships",
        label: "Affiliations",
        data: country.memberOf.slice().sort((a, b) => a.localeCompare(b)),
      });
    }

    return sections;
  }, [country]);

  const [expanded, setExpanded] = useState(() =>
    sections.reduce(
      (acc, s) => {
        acc[s.key] = !!s.data?.length;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const handleToggle = (key: string) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="flex-1 overflow-y-auto">
      {sections.map(
        (section) =>
          section.data &&
          section.data.length > 0 && (
            <CollapsibleHeader
              key={section.key}
              label={`${section.label} (${section.data.length})`}
              expanded={expanded[section.key]}
              icon={undefined}
              onToggle={() => handleToggle(section.key)}
            >
              {section.data.length === 0 ? (
                <EmptyListMessage message="No items." />
              ) : (
                <div className="flex flex-col text-lg">
                  {section.data.map((item, idx) => (
                    <MenuButton
                      key={`${section.key}-${item}-${idx}`}
                      icon={undefined}
                      onClick={() => {}}
                      className="py-2 px-2"
                    >
                      <span>{item.replace(/[_-]/g, " ")}</span>
                    </MenuButton>
                  ))}
                </div>
              )}
            </CollapsibleHeader>
          ),
      )}
    </div>
  );
}
