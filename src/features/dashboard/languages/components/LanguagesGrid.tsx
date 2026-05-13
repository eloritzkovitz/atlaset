import React from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "@types";
import { DashboardListGrid } from "../../common/components/DashboardListGrid";

interface LanguagesGridProps {
  languages: Language[];
}

export const LanguagesGrid: React.FC<LanguagesGridProps> = ({ languages }) => {
  const { t } = useTranslation("dashboard");

  return (
    <DashboardListGrid
      items={languages}
      getCode={(l) => l.code}
      getName={(l) => l.name ?? l.nativeName ?? l.code}
      toLink={(l) => `/dashboard/languages/${l.code}`}
      searchPlaceholder={t("languages.searchPlaceholder", {
        defaultValue: "Search by name or code",
      })}
      emptyMessage={t("languages.empty", {
        defaultValue: "Language not found.",
      })}
    />
  );
};
