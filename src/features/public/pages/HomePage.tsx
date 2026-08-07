import { useTranslation } from "react-i18next";
import { usePageTitle } from "@hooks";
import { CallToActionSection } from "../components/CallToActionSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { HeroSection } from "../components/HeroSection";

export default function HomePage() {
  const { t } = useTranslation("home");

  usePageTitle(t("pageTitle", "Atlaset: Your travel companion"), {
    disableSuffix: true,
  });

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CallToActionSection />
    </main>
  );
}
