import type { Currency } from "@features/countries";

const APP_ID = import.meta.env.VITE_OPENEXCHANGE_APP_ID;
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`;

/**
 * Fetches latest currency exchange rates from Open Exchange Rates API.
 * @returns A promise that resolves to an object mapping currency codes to exchange rates.
 */
export async function fetchExchangeRates() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch exchange rates");
  const data = await res.json();
  return data.rates as Record<string, number>;
}

/**
 * Converts an amount from one currency to another using provided exchange rates.
 * @param amount - The amount of money to convert.
 * @param from - The currency code of the original currency.
 * @param to - The currency code of the target currency.
 * @param rates - An object mapping currency codes to their exchange rates relative to a base currency.
 * @returns The converted amount in the target currency.
 */
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number {
  if (!rates[from] || !rates[to])
    throw new Error("Currency not found in rates");
  return amount * (rates[to] / rates[from]);
}

/**
 * Gets the name of a currency by its code.
 * @param code - The ISO code of the currency.
 * @param currencies - Array of currency objects.
 * @returns The currency name if found, otherwise the code.
 */
export function getCurrencyName(code: string, currencies: Currency[]): string {
  const found = currencies.find((c) => c.code === code);
  return found ? found.name : code;
}
