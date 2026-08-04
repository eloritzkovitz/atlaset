import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Country } from "@features/countries";
import type { Language } from "@types";
import { getQueryParam } from "@utils";
import { InfoWithCountryGroups } from "../../common/components/InfoWithCountryGroups";
import { WikipediaButton } from "../../common/components/WikipediaButton";
import { useIsoGroups } from "../../common/hooks/useIsoGroups";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";

interface LanguageInfoProps {
  languages: Language[];
  countries: Country[];
}

export const LanguageInfo: React.FC<LanguageInfoProps> = ({
  languages,
  countries,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { code: routeCode } = useParams<{ code?: string }>();

  // Resolve code via route param or fallback query string
  const code = routeCode || getQueryParam("code", "", location.search);
  const language = languages.find((l) => l.code === code);

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

  // Redirect to languages list if language not found
  useEffect(() => {
    if (!language && languages.length > 0) {
      navigate("/dashboard/languages", { replace: true });
    }
  }, [language, languages, navigate]);

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
