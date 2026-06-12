import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { CallToActionSection } from "@features/home/CallToActionSection";
import { FeaturesSection } from "@features/home/FeaturesSection";
import { HeroSection } from "@features/home/HeroSection";
import { usePageTitle } from "@hooks";

export default function HomePage() {
  const { t } = useTranslation("home");
  const { user, loading } = useAuth();

  // Set page title
  usePageTitle(t("pageTitle", "Atlaset: Your travel companion"));

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
