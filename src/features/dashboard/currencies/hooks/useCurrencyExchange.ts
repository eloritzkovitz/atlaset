import { useState, useEffect } from "react";
import { fetchExchangeRates, convertCurrency } from "../utils/currencyExchange";
import { getCountryByIsoCode } from "@features/countries";
import { useCountryData } from "@features/countries";
import { useHomeCountry } from "@features/user";

/**
 * Manages currency exchange state and logic.
 * @returns State and handlers for currency exchange functionality.
 */
export function useCurrencyExchange() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [converted, setConverted] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Get country and currency data
  const { countries, currencies } = useCountryData();
  const { homeCountry } = useHomeCountry();

  // Set default currencies based on homeCountry and fallback
  useEffect(() => {
    if (!from && !to && homeCountry) {
      const homeCountryObj = getCountryByIsoCode(homeCountry, { countries });
      const homeCurrency = homeCountryObj?.currency;

      // Fallback to common currencies if home currency not found
      const usd = currencies.find((c) => c.code === "USD")?.code;
      const eur = currencies.find((c) => c.code === "EUR")?.code;

      setFrom(homeCurrency || usd || eur || "");
      setTo(usd || eur || "");
    }
  }, [homeCountry, currencies, from, to, countries]);

  // Conversion logic
  const handleConvert = async () => {
    setError(null);
    setLoading(true);
    try {
      // Validate inputs
      if (!from || !to) {
        setError("Select both currencies.");
        setLoading(false);
        return;
      }

      const fetchedRates = await fetchExchangeRates();

      // Ensure selected currencies are in the fetched rates
      if (!fetchedRates[from] || !fetchedRates[to]) {
        setError("Selected currency not available in rates.");
        setLoading(false);
        return;
      }

      // Perform conversion
      const result = convertCurrency(amount, from, to, fetchedRates);
      setConverted(result);
      setRate(fetchedRates[to] / fetchedRates[from]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error fetching rates.");
      } else {
        setError("Error fetching rates.");
      }
    }
    setLoading(false);
  };

  // Swap currencies
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setConverted(null);
    setRate(null);
    setError(null);
  };

  return {
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
  };
}
