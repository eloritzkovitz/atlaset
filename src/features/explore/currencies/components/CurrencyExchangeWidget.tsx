import { useTranslation } from "react-i18next";
import { FaRightLeft } from "react-icons/fa6";
import { ActionButton, Card } from "@components";
import { type Currency } from "@features/countries/types";
import { usePageTitle } from "@hooks";
import { CurrencyInputRow } from "./CurrencyInputRow";
import { useCurrencyExchange } from "../hooks/useCurrencyExchange";
import { getCurrencyName } from "../utils/currency";

interface CurrencyExchangeWidgetProps {
  currencies: Currency[];
}

export function CurrencyExchangeWidget({
  currencies,
}: CurrencyExchangeWidgetProps) {
  const { t } = useTranslation("explore");

  usePageTitle(t("currencies.currencyExchange.pageTitle", "Currency Exchange"));

  const {
    from,
    setFrom,
    to,
    setTo,
    amount,
    setAmount,
    error,
    converted,
    rate,
    loading,
    handleSwap,
    isReady,
  } = useCurrencyExchange();

  const currencyOptions = currencies.map((cur) => ({
    label: `${cur.code} - ${cur.name}`,
    value: cur.code,
  }));

  return (
    <Card className="max-w-2xl mx-auto flex flex-col p-0 overflow-hidden">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-center mb-4">
          <div className="text-muted text-sm">
            {t("currencies.currencyExchange.exchangeHeader", {
              currency: getCurrencyName(from, currencies),
              defaultValue: `1 ${getCurrencyName(from, currencies)} equals`,
            })}
          </div>

          {isReady && !error && (
            <div className="flex items-center gap-1.5 text-xs text-success font-medium">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              {t("currencies.currencyExchange.statusLive", {
                defaultValue: "Live Rates",
              })}
            </div>
          )}
        </div>

        {rate !== null && (
          <h3 className="text-3xl font-bold text-start tracking-tight">
            {t("currencies.currencyExchange.rateValue", {
              rate: rate.toFixed(4),
              currency: getCurrencyName(to, currencies),
              defaultValue: `${rate.toFixed(4)} ${getCurrencyName(to, currencies)}`,
            })}
          </h3>
        )}
        <div className="py-6 flex flex-wrap items-center justify-between gap-2 text-sm !text-muted">
          <a
            href="https://openexchangerates.org"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors rounded !text-muted hover:!text-info focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("currencies.currencyExchange.disclaimer", {
              defaultValue: "Data via Open Exchange Rates",
            })}
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <CurrencyInputRow
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            selectValue={from}
            onSelectChange={(value) => setFrom(String(value))}
            selectOptions={currencyOptions}
            selectPlaceholder={t("currencies.currencyExchange.from", {
              defaultValue: "From",
            })}
            disabled={loading || !isReady}
            inputAriaLabel={t(
              "currencies.currencyExchange.input.amountToConvert",
              { defaultValue: "Amount to convert" },
            )}
            selectAriaLabel={t("currencies.currencyExchange.select.from", {
              defaultValue: "From currency",
            })}
          />

          <div className="flex justify-center my-1">
            <ActionButton
              variant="action"
              onClick={handleSwap}
              ariaLabel={t("currencies.currencyExchange.swap.ariaLabel", {
                defaultValue: "Swap currencies",
              })}
              title={t("currencies.currencyExchange.swap.title", {
                defaultValue: "Swap",
              })}
              titlePosition="top"
              icon={<FaRightLeft />}
              disabled={!from || !to || !isReady}
            />
          </div>

          <CurrencyInputRow
            value={
              loading
                ? t("currencies.currencyExchange.loading", {
                    defaultValue: "Loading...",
                  })
                : converted !== null
                  ? converted.toFixed(2)
                  : ""
            }
            onChange={() => {}}
            selectValue={to}
            onSelectChange={(value) => setTo(String(value))}
            selectOptions={currencyOptions}
            selectPlaceholder={t("currencies.currencyExchange.to", {
              defaultValue: "To",
            })}
            readOnly
            inputAriaLabel={t(
              "currencies.currencyExchange.input.convertedAmount",
              { defaultValue: "Converted amount" },
            )}
            selectAriaLabel={t("currencies.currencyExchange.select.to", {
              defaultValue: "To currency",
            })}
          />
        </div>

        {error && (
          <div className="text-danger mt-4 text-center text-sm font-medium">
            {t("currencies.currencyExchange.errorPrefix", {
              defaultValue: "Error:",
            })}{" "}
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
