import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DirectionalIcon, EmptyListMessage, SearchInput } from "@components";
import { type Currency } from "@features/countries";
import { useLanguage } from "@features/settings";

interface CurrenciesGridProps {
  currencies: Currency[];
}

export const CurrenciesGrid: React.FC<CurrenciesGridProps> = ({
  currencies,
}) => {
  const [search, setSearch] = useState("");
  const filtered = currencies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );
  const { t } = useTranslation("dashboard");
  const { isRtl } = useLanguage();

  return (
    <section className="max-w-6xl mx-auto p-4">
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
      <div className="flex justify-between items-center mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("currencies.searchPlaceholder", {
            defaultValue: "Search by name or code",
          })}
        />
      </div>
      <ul className="divide-y divide-input bg-surface-alt rounded shadow mt-4">
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyListMessage
              message={t("currencies.empty", {
                defaultValue: "Currency not found.",
              })}
            />
          </div>
        ) : (
          filtered.map((currency) => (
            <li key={currency.code}>
              <Link
                to={`/dashboard/currencies/${currency.code}`}
                className={`grid ${isRtl ? "grid-cols-[1fr_100px]" : "grid-cols-[100px_1fr]"} items-center p-4 hover:bg-surface-hover transition rounded focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                {isRtl ? (
                  <>
                    <span className="text-right">{currency.name}</span>
                    <span className="font-semibold text-lg ps-14">
                      {currency.code}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-lg pe-4">
                      {currency.code}
                    </span>
                    <span className="text-left">{currency.name}</span>
                  </>
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};
