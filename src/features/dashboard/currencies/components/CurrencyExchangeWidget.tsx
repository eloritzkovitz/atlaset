import { FaRightLeft } from "react-icons/fa6";
import { ActionButton, Card } from "@components";
import { useTranslation } from "react-i18next";
import { type Currency } from "@features/countries";
import { CurrencyInputRow } from "./CurrencyInputRow";
import { useCurrencyExchange } from "../hooks/useCurrencyExchange";
import { getCurrencyName } from "../utils/currencyExchange";

interface CurrencyExchangeWidgetProps {
  currencies: Currency[];
}

export function CurrencyExchangeWidget({
  currencies,
}: CurrencyExchangeWidgetProps) {
  const { t } = useTranslation("dashboard");

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
    handleConvert,
    handleSwap,
  } = useCurrencyExchange();

  // Prepare options for select inputs
  const currencyOptions = currencies.map((cur) => ({
    label: `${cur.code} - ${cur.name}`,
    value: cur.code,
  }));

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center text-muted mb-4 text-start">
        {t("currencies.currencyExchange.exchangeHeader", {
          currency: getCurrencyName(from, currencies),
          defaultValue: `1 ${getCurrencyName(from, currencies)} equals`,
        })}
      </div>
      {rate !== null && (
        <h3 className="text-2xl font-semibold text-center mb-4">
          {t("currencies.currencyExchange.rateValue", {
            rate: rate.toFixed(2),
            currency: getCurrencyName(to, currencies),
            defaultValue: `${rate.toFixed(2)} ${getCurrencyName(to, currencies)}`,
          })}
        </h3>
      )}
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
          inputAriaLabel={t(
            "currencies.currencyExchange.input.amountToConvert",
            {
              defaultValue: "Amount to convert",
            },
          )}
          selectAriaLabel={t("currencies.currencyExchange.select.from", {
            defaultValue: "From currency",
          })}
        />
        <div className="flex justify-center">
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
            disabled={!from || !to}
          />
        </div>
        <CurrencyInputRow
          value={converted !== null ? converted.toFixed(2) : ""}
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
            {
              defaultValue: "Converted amount",
            },
          )}
          selectAriaLabel={t("currencies.currencyExchange.select.to", {
            defaultValue: "To currency",
          })}
        />
        <ActionButton
          variant="primary"
          onClick={handleConvert}
          disabled={loading || !from || !to || amount <= 0}
          ariaLabel={t("currencies.currencyExchange.convert", {
            defaultValue: "Convert",
          })}
          className="w-full mt-2"
        >
          {loading
            ? t("currencies.currencyExchange.converting", {
                defaultValue: "Converting...",
              })
            : t("currencies.currencyExchange.convert", {
                defaultValue: "Convert",
              })}
        </ActionButton>
      </div>
      {error && (
        <div className="text-danger mt-4 text-center">
          {t("currencies.currencyExchange.errorPrefix", {
            defaultValue: "Error:",
          })}{" "}
          {error}
        </div>
      )}
    </Card>
  );
}
