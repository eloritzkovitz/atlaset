const APP_ID = import.meta.env.VITE_OPENEXCHANGE_APP_ID;
const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`;

/**
 * Fetches the latest currency exchange rates from the Open Exchange Rates API.
 */
export const exchangeRateClient = {
  async fetchRates(): Promise<Record<string, number>> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch exchange rates");
    const data = await res.json();
    return data.rates || {};
  },
};
