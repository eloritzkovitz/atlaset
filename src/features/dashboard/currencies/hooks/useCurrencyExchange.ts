import { useState, useEffect } from "react";
import { getCountryByIsoCode, useCountryData } from "@features/countries";
import { useHomeCountry } from "@features/user";
import { exchangeRateClient } from "@lib/exchange-rates";
import { convertCurrency } from "../utils/currency";

/**
 * Manages currency exchange state and logic.
 * @returns State and handlers for currency exchange functionality.
 */
export function useCurrencyExchange() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);

  // Get country and currency data
  const { countries, currencies } = useCountryData();
  const { homeCountry } = useHomeCountry();

  // Fetched rates on conversion
  useEffect(() => {
    async function loadInitialRates() {
      setLoading(true);
      try {
        const fetchedRates = await exchangeRateClient.fetchRates();
        setRates(fetchedRates);
      } catch (err) {
        setError("Could not load latest exchange rates.");
      } finally {
        setLoading(false);
      }
    }
    loadInitialRates();
  }, []);

  // Set default currencies based on homeCountry and fallback
  useEffect(() => {
    if (!from && !to && homeCountry && currencies.length > 0) {
      const homeCountryObj = getCountryByIsoCode(homeCountry, { countries });
      const homeCurrency = homeCountryObj?.currency;

      const usd = currencies.find((c) => c.code === "USD")?.code;
      const eur = currencies.find((c) => c.code === "EUR")?.code;

      setFrom(homeCurrency || usd || eur || "");
      setTo(usd || eur || "");
    }
  }, [homeCountry, currencies, from, to, countries]);

  // Calculate converted amount and rate if rates are available
  let converted: number | null = null;
  let rate: number | null = null;

  if (rates && from && to && rates[from] && rates[to]) {
    try {
      converted = convertCurrency(amount, from, to, rates);
      rate = rates[to] / rates[from];
    } catch (err) {
      // Gracefully handled by initial fallbacks
    }
  }

  // Swap currencies handler
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
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
    handleSwap,
    isReady: !!rates && !loading,
  };
}
