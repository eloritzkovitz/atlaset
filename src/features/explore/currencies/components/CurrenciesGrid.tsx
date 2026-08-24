import React from "react";
import { useTranslation } from "react-i18next";
import { SectionLink } from "@components";
import type { Currency } from "@features/countries/types";
import { ExploreListGrid } from "../../core/components/ExploreListGrid";

interface CurrenciesGridProps {
  currencies: Currency[];
}

export const CurrenciesGrid: React.FC<CurrenciesGridProps> = ({
  currencies,
}) => {
  const { t } = useTranslation("dashboard");

  return (
    <ExploreListGrid
      items={currencies}
      getCode={(c) => c.code}
      getName={(c) => c.name}
      toLink={(c) => `/explore/currencies/${c.code}`}
      headerActions={
        <SectionLink
          to="/explore/currencies/exchange"
          label="Currency Exchange"
          align="right"
        />
      }
      headers={{
        codeLabel: t("currencies.columns.code", {
          defaultValue: "Currency code",
        }),
        nameLabel: t("currencies.columns.name", {
          defaultValue: "Currency name",
        }),
      }}
      searchPlaceholder={t("currencies.searchPlaceholder", {
        defaultValue: "Search by name or code",
      })}
      emptyMessage={t("currencies.empty", {
        defaultValue: "Currency not found.",
      })}
    />
  );
};
