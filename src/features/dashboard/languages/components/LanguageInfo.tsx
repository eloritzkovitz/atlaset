import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CountryListGroup } from "@features/countries";
import type { Country } from "@features/countries";
import type { Language } from "@types";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";

interface LanguageInfoProps {
  language: Language | undefined;
  countries: Country[];
}

export const LanguageInfo: React.FC<LanguageInfoProps> = ({
  language,
  countries,
}) => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const { handleCountrySelect, handleBack } = useDashboardNavigation(
    countries,
    "",
    "",
  );

  const [expandedSovereign, setExpandedSovereign] = useState(true);
  const [expandedDependencies, setExpandedDependencies] = useState(true);

  const languageCode = language?.code;
  const languageName = (language?.name ??
    language?.nativeName ??
    languageCode) as string;

  const { sovereignIsoCodes, dependencyIsoCodes } = useMemo(() => {
    const sov: string[] = [];
    const dep: string[] = [];
    if (!languageCode)
      return { sovereignIsoCodes: sov, dependencyIsoCodes: dep };
    for (const c of countries) {
      if (!Array.isArray(c.languages) || !c.languages.includes(languageCode))
        continue;
      if (
        c.sovereigntyStatus === "sovereign" ||
        c.sovereigntyStatus === "partially_recognized"
      ) {
        sov.push(c.isoCode);
      } else {
        dep.push(c.isoCode);
      }
    }
    return { sovereignIsoCodes: sov, dependencyIsoCodes: dep };
  }, [countries, languageCode]);

  useEffect(() => {
    if (!language) navigate("/dashboard/languages");
  }, [language, navigate]);
  if (!language) return null;

  return (
    <section className="max-w-6xl mx-auto">
      <DashboardHeader
        title={languageName}
        subtitle={languageCode ? `(${languageCode})` : undefined}
        onBack={handleBack}
      />
      {sovereignIsoCodes.length > 0 && (
        <CountryListGroup
          label={t("languages.languageInfo.usingLanguage", {
            name: languageName,
            defaultValue: `Countries where ${languageName} is spoken`,
          })}
          isoCodes={sovereignIsoCodes}
          countries={countries}
          expanded={expandedSovereign}
          onToggle={() => setExpandedSovereign((prev) => !prev)}
          onSelectCountry={handleCountrySelect}
        />
      )}
      {dependencyIsoCodes.length > 0 && (
        <CountryListGroup
          label={t("languages.languageInfo.dependenciesUsingLanguage", {
            name: languageName,
            defaultValue: `Dependencies and territories where ${languageName} is spoken`,
          })}
          isoCodes={dependencyIsoCodes}
          countries={countries}
          expanded={expandedDependencies}
          onToggle={() => setExpandedDependencies((prev) => !prev)}
          onSelectCountry={handleCountrySelect}
        />
      )}
    </section>
  );
};
