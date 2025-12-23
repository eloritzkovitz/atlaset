import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@contexts/AuthContext";
import {
  getHomeCountry,
  setHomeCountry as setHomeCountryService,
} from "../services/profileService";

/**
 * Manages home country for the current user.
 * @returns Home country, setter.
 */
export function useHomeCountry() {
  const { user } = useAuth();
  const [homeCountry, setHomeCountryState] = useState("");

  // Fetch home country from Firestore on user change
  useEffect(() => {
    if (!user) {
      setHomeCountryState("");
      return;
    }
    const fetchHomeCountry = async () => {
      const country = await getHomeCountry(user.uid);
      setHomeCountryState(country);
    };
    fetchHomeCountry();
  }, [user]);

  // Setter to update home country in Firestore
  const setHomeCountry = useCallback(
    async (country: string) => {
      if (!user) return;
      await setHomeCountryService(user.uid, country);
      setHomeCountryState(country);
    },
    [user]
  );

  return {
    homeCountry,
    setHomeCountry,
  };
}
