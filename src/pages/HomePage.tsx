import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@components";
import { CallToActionSection } from "@features/home/CallToActionSection";
import { FeaturesSection } from "@features/home/FeaturesSection";
import { HeroSection } from "@features/home/HeroSection";
import { useAuth } from "@features/user/auth";
import { usePageTitle } from "@hooks";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation("home");

  usePageTitle(t("pageTitle", "Atlaset: Your travel companion"), {
    disableSuffix: true,
  });

  // Show loading spinner while auth state is loading
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // If user is logged in, redirect to atlas
  if (user) {
    return <Navigate to="/atlas" replace />;
  }

  // Not loading and no user: show homepage content
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
    </main>
  );
}
