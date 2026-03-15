import { FaRightLeft } from "react-icons/fa6";
import { ActionButton, Card } from "@components";
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
        1 {getCurrencyName(from, currencies)} equals
      </div>
      {rate !== null && (
        <h3 className="text-2xl font-semibold text-center mb-4">
          {rate.toFixed(2)} {getCurrencyName(to, currencies)}
        </h3>
      )}
      <div className="flex flex-col gap-4">
        <CurrencyInputRow
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          selectValue={from}
          onSelectChange={(value) => setFrom(String(value))}
          selectOptions={currencyOptions}
          selectPlaceholder="From"
          inputAriaLabel="Amount to convert"
          selectAriaLabel="From currency"
        />
        <div className="flex justify-center">
          <ActionButton
            variant="action"
            onClick={handleSwap}
            ariaLabel="Swap currencies"
            title="Swap"
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
          selectPlaceholder="To"
          readOnly
          inputAriaLabel="Converted amount"
          selectAriaLabel="To currency"
        />
        <ActionButton
          variant="primary"
          onClick={handleConvert}
          disabled={loading || !from || !to || amount <= 0}
          ariaLabel="Convert currencies"
          className="w-full mt-2"
        >
          {loading ? "Converting..." : "Convert"}
        </ActionButton>
      </div>
      {error && (
        <div className="text-danger mt-4 text-center">Error: {error}</div>
      )}
    </Card>
  );
}
