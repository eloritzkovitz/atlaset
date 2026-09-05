const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetches the latest currency exchange rates from the Open Exchange Rates API.
 */
export const exchangeRateClient = {
  async fetchRates(): Promise<Record<string, number>> {
    const res = await fetch(`${API_URL}/api/exchange-rates`);

    if (!res.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await res.json();

    return data.rates ?? {};
  },
};
