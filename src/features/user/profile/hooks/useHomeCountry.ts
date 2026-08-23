import { useEffect, useState, useCallback } from "react";
import { profileService } from "../services/profileService";
import { useAuth } from "../../auth/hooks/useAuth";

/**
 * Manages home country for the current user.
 * @returns Home country, setter.
 */
export function useHomeCountry() {
  const { user } = useAuth();
  const [homeCountry, setHomeCountryState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHomeCountryState("");
      setLoading(false);
      return;
    }

    const fetchHomeCountry = async () => {
      setLoading(true);

      try {
        const country = await profileService.getHomeCountry(user.uid);
        setHomeCountryState(country);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeCountry();
  }, [user]);

  // Set home country for the current user
  const setHomeCountry = useCallback(
    async (country: string) => {
      if (!user) return;

      await profileService.setHomeCountry(user.uid, country);
      setHomeCountryState(country);
    },
    [user],
  );

  return {
    homeCountry,
    loading,
    setHomeCountry,
  };
}
