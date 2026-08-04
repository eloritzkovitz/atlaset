import { useTranslation } from "react-i18next";
import { CallToActionSection } from "@features/home/CallToActionSection";
import { FeaturesSection } from "@features/home/FeaturesSection";
import { HeroSection } from "@features/home/HeroSection";
import { usePageTitle } from "@hooks";

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
