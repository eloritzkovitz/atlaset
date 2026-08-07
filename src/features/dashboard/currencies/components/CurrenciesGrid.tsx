import React from "react";
import { useTranslation } from "react-i18next";
import { SectionLink } from "@components";
import type { Currency } from "@features/countries/types";
import { DashboardListGrid } from "../../core/components/DashboardListGrid";

interface CurrenciesGridProps {
  currencies: Currency[];
}

export const CurrenciesGrid: React.FC<CurrenciesGridProps> = ({
  currencies,
}) => {
  const { t } = useTranslation("dashboard");

  return (
    <DashboardListGrid
      items={currencies}
      getCode={(c) => c.code}
      getName={(c) => c.name}
      toLink={(c) => `/dashboard/currencies/${c.code}`}
      headerActions={
        <SectionLink
          to="/dashboard/currencies/exchange"
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
