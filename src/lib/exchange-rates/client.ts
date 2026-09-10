import { getBackendUrl } from "../api-client/backend";

/**
 * Fetches the latest currency exchange rates from the Open Exchange Rates API.
 */
export const exchangeRateClient = {
  async fetchRates(): Promise<Record<string, number>> {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/exchange-rates`);

    if (!res.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await res.json();

    return data.rates ?? {};
  },
};
