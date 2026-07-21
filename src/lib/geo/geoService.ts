interface IpWhoIsResponse {
  ip?: string;
  country?: string;
  country_code?: string;
  city?: string;
  success: boolean;
  message?: string;
}

interface IpGeoData {
  ipAddress: string;
  countryCode: string | null;
  location: string;
}

/**
 * Service for fetching geolocation data based on IP address.
 */
export const geoService = {
  /** Fetches geolocation details for a specific IP, or the caller's IP if omitted. */
  async getGeoData(ipAddress?: string): Promise<IpGeoData | null> {
    try {
      const url = ipAddress
        ? `https://ipwho.is/${ipAddress}`
        : "https://ipwho.is/";
      const response = await fetch(url);

      if (!response.ok) return null;

      const data: IpWhoIsResponse = await response.json();

      if (data.success === false) return null;

      const ip = data.ip || "Unknown IP";
      const location =
        data.city && data.country
          ? `${data.city}, ${data.country}`
          : data.country || "Unknown Location";

      return {
        ipAddress: ip,
        countryCode: data.country_code || null,
        location,
      };
    } catch (error) {
      console.error("Geo utility fetch failed:", error);
      return null;
    }
  },
};
