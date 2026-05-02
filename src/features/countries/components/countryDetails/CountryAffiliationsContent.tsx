import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader, EmptyListMessage, MenuButton } from "@components";
import type { Country } from "@features/countries/types";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import { SPECIAL_COUNTRIES } from "../../constants/specialCountries";

interface CountryAffiliationsContentProps {
  country: Country;
}

export function CountryAffiliationsContent({
  country,
}: CountryAffiliationsContentProps) {
  const { t } = useTranslation("atlas");

  const sections = useMemo(() => {
    if (!country) return [];

    const sections: { key: string; label: string; data: string[] }[] = [];

    // Add memberships section if there are any memberships or UN membership
    const memberships: string[] = [];
    if (country.memberOf && country.memberOf.length > 0) {
      memberships.push(...country.memberOf.slice());
    }
    if (country.unMember) {
      if (!memberships.map((m) => String(m).toUpperCase()).includes("UN")) {
        memberships.push("UN");
      }
    }

    if (memberships.length > 0) {
      const sorted = memberships.slice().sort((a, b) => {
        const A = String(a).toUpperCase();
        const B = String(b).toUpperCase();
        if (A === "UN" && B !== "UN") return -1;
        if (B === "UN" && A !== "UN") return 1;
        return String(a).localeCompare(String(b));
      });

      sections.push({
        key: "memberships",
        label: t("country.affiliations.memberships"),
        data: sorted,
      });
    }

    return sections;
  }, [country, t]);

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
              label={section.label}
              count={section.data.length}
              expanded={expanded[section.key]}
              icon={undefined}
              onToggle={() => handleToggle(section.key)}
            >
              {section.data.length === 0 ? (
                <EmptyListMessage message="No items." />
              ) : (
                <div className="flex flex-col text-lg">
                  {section.data.map((item, idx) => {
                    const iso = String(item || "").toUpperCase();
                    const special = SPECIAL_COUNTRIES[iso];
                    const displayName =
                      (special && special.name) || item.replace(/[_-]/g, " ");

                    return (
                      <MenuButton
                        key={`${section.key}-${item}-${idx}`}
                        icon={undefined}
                        onClick={() => {}}
                        className="py-2 px-2"
                      >
                        {special ? (
                          <div className="flex items-center">
                            <CountryWithFlag
                              isoCode={iso}
                              name={displayName}
                              visited={true}
                            />
                          </div>
                        ) : (
                          <span>{displayName}</span>
                        )}
                      </MenuButton>
                    );
                  })}
                </div>
              )}
            </CollapsibleHeader>
          ),
      )}
    </div>
  );
}
