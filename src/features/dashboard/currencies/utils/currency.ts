/**
 * Utility functions for currency exchange operations.
 */

import type { Currency } from "@features/countries";

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
