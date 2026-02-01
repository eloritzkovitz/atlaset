import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { CallToActionSection } from "@layout/Home/CallToActionSection";
import { FeaturesSection } from "@layout/Home/FeaturesSection";
import { HeroSection } from "@layout/Home/HeroSection";
import { usePageTitle } from "@hooks";

export default function HomePage() {
  const { user, loading } = useAuth();

  // Set page title
  usePageTitle("Atlaset: Your travel companion");

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
