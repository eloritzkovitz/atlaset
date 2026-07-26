import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Country } from "@features/countries";
import type { Language } from "@types";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";
import { useIsoGroups } from "../../common/hooks/useIsoGroups";
import { InfoWithCountryGroups } from "../../common/components/InfoWithCountryGroups";
import { WikipediaButton } from "../../common/components/WikipediaButton";

interface LanguageInfoProps {
  language: Language | undefined;
  countries: Country[];
}

export const LanguageInfo: React.FC<LanguageInfoProps> = ({
  language,
  countries,
}) => {
  const navigate = useNavigate();
  const { handleCountrySelect, handleBack } = useDashboardNavigation(
    countries,
    "",
    "",
  );

  const languageCode = language?.code;
  const languageName = (language?.name ??
    language?.nativeName ??
    languageCode) as string;

  const isoGroups = useIsoGroups(countries, (c) =>
    languageCode
      ? Array.isArray(c.languages) && c.languages.includes(languageCode)
      : false,
  );

  useEffect(() => {
    if (!language) navigate("/dashboard/languages");
  }, [language, navigate]);
  if (!language) return null;

  return (
    <InfoWithCountryGroups
      title={languageName}
      subtitle={languageCode ? `(${languageCode})` : undefined}
      actions={<WikipediaButton searchTerm={`${language.name} language`} />}
      onBack={handleBack}
      isoGroups={isoGroups}
      primaryLabelKey="languages.languageInfo.usingLanguage"
      dependencyLabelKey="languages.languageInfo.dependenciesUsingLanguage"
      labelArgs={{ name: languageName }}
      onSelectCountry={handleCountrySelect}
      countries={countries}
    />
  );
};
