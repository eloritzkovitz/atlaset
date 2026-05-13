import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DirectionalIcon } from "@components";
import type { Currency } from "@features/countries";
import { DashboardListGrid } from "../../common/components/DashboardListGrid";

interface CurrenciesGridProps {
  currencies: Currency[];
}

export const CurrenciesGrid: React.FC<CurrenciesGridProps> = ({
  currencies,
}) => {
  const { t } = useTranslation("dashboard");

  const header = (
    <Link
      to="/dashboard/currencies/exchange"
      className="flex items-center justify-end text-xl font-semibold mb-4 gap-2 focus:outline-none"
      aria-label={t("currencies.viewExchange", {
        defaultValue: "View currency exchange",
      })}
    >
      <span>
        {t("menu.currencyExchange", { defaultValue: "Currency Exchange" })}
      </span>
      <DirectionalIcon direction="next" className="text-base" />
    </Link>
  );

  return (
    <DashboardListGrid
      items={currencies}
      getCode={(c) => c.code}
      getName={(c) => c.name}
      toLink={(c) => `/dashboard/currencies/${c.code}`}
      headerActions={header}
      searchPlaceholder={t("currencies.searchPlaceholder", {
        defaultValue: "Search by name or code",
      })}
      emptyMessage={t("currencies.empty", {
        defaultValue: "Currency not found.",
      })}
    />
  );
};
