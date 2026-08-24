import React from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "@types";
import { ExploreListGrid } from "../../core/components/ExploreListGrid";

interface LanguagesGridProps {
  languages: Language[];
}

export const LanguagesGrid: React.FC<LanguagesGridProps> = ({ languages }) => {
  const { t } = useTranslation("dashboard");

  return (
    <ExploreListGrid
      items={languages}
      getCode={(l) => l.code}
      getName={(l) => l.name ?? l.nativeName ?? l.code}
      toLink={(l) => `/explore/languages/${l.code}`}
      headers={{
        codeLabel: t("languages.columns.code", {
          defaultValue: "Language code",
        }),
        nameLabel: t("languages.columns.name", {
          defaultValue: "Language name",
        }),
      }}
      searchPlaceholder={t("languages.searchPlaceholder", {
        defaultValue: "Search by name or code",
      })}
      emptyMessage={t("languages.empty", {
        defaultValue: "Language not found.",
      })}
    />
  );
};
