import { useCallback, useEffect } from "react";
import { initializeAnalytics, logToGoogleAnalytics } from "@lib/firebase";
import { usePrivacySettings } from "./usePrivacySettings";

/**
 * Provides a hook for tracking analytics events, respecting user consent for analytics.
 */
export function useAnalytics() {
  const [{ analyticsConsent }] = usePrivacySettings();

  // Initialize analytics if consent is given
  useEffect(() => {
    if (analyticsConsent === true) {
      void initializeAnalytics();
    }
  }, [analyticsConsent]);

  // Explicitly track page views on SPA route changes
  useEffect(() => {
    if (analyticsConsent === true) {
      logToGoogleAnalytics("page_view", {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [analyticsConsent]);

  /** Tracks events only if consent is given. */
  const trackEvent = useCallback(
    (
      eventName: string,
      eventParams?: Record<string, unknown>,
      actionId?: number,
    ) => {
      if (analyticsConsent === true) {
        logToGoogleAnalytics(eventName, eventParams ?? {}, actionId);
      }
    },
    [analyticsConsent],
  );

  return {
    trackEvent,
    isConsentGiven: analyticsConsent === true,
  };
}
