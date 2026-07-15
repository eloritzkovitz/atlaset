import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { usePrivacySettings } from "../hooks/usePrivacySettings";

export function CookieConsentModal() {
  const { user } = useAuth();
  const [{ analyticsConsent }, setPrivacySettings] = usePrivacySettings();
  const navigate = useNavigate();
  const { t } = useTranslation("settings");

  const [isReadyToShow, setIsReadyToShow] = useState(false);

  // Initialize analytics if consent is given
  useAnalytics();

  // Show the banner after a delay if consent is not yet given or rejected
  useEffect(() => {
    if (analyticsConsent !== null) return;

    const timer = setTimeout(() => {
      setIsReadyToShow(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [analyticsConsent]);

  // If consent is already given or rejected, do not show the banner
  if (analyticsConsent !== null || !isReadyToShow) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[11000] pointer-events-auto"
        aria-hidden="true"
      />

      <div className="fixed top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2 z-[11001] w-[calc(100%-2rem)] max-w-[600px] pointer-events-auto">
        <div className="flex flex-col p-5 md:p-6 bg-surface rounded-xl shadow-lg gap-10">
          <div className="flex flex-col gap-2 max-w-prose">
            <h2 className="text-xl md:text-2xl font-bold leading-snug text-start mb-2">
              {t("privacy.cookies.title", "This site uses cookies")}
            </h2>
            <div className="space-y-4 text-start text-sm md:text-base text-muted leading-relaxed">
              <p>
                {t(
                  "privacy.cookies.paragraph1",
                  "We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts.",
                )}
              </p>
              <p>
                {t(
                  "privacy.cookies.paragraph2",
                  "By clicking 'Accept', you consent to this data collection. You can change your preference at any time in your Privacy Settings.",
                )}
              </p>
            </div>
            <div className="text-start mt-6 mb-6">
              <Link
                to="/privacy"
                className="inline-block text-sm md:text-base text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
              >
                {t(
                  "privacy.cookies.learnMore",
                  "Learn more about our privacy policy",
                )}
              </Link>
            </div>
          </div>

          <div className="flex justify-start gap-2">
            <ActionButton
              variant="primary"
              className="min-w-[100px] !rounded-full"
              onClick={() => setPrivacySettings({ analyticsConsent: true })}
            >
              {t("privacy.acceptButton", "Accept")}
            </ActionButton>
            <ActionButton
              variant="secondary"
              className="min-w-[100px] !rounded-full !bg-input hover:!bg-input-hover"
              onClick={() => setPrivacySettings({ analyticsConsent: false })}
            >
              {t("privacy.declineButton", "Decline")}
            </ActionButton>
            {user && (
              <ActionButton
                variant="secondary"
                className="min-w-[100px] !rounded-full !bg-input hover:!bg-input-hover"
                onClick={() => navigate("/settings/privacy")}
              >
                {t("privacy.changePreference", "Change my preference")}
              </ActionButton>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
