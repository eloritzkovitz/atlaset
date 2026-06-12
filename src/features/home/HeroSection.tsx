import { useTranslation } from "react-i18next";
import { ActionButton, Card } from "@components";

export function HeroSection() {
  const { t } = useTranslation("home");

  return (
    <section className="flex items-center justify-center py-16 px-4">
      <div className="flex w-full max-w-[2000px] gap-8 items-stretch">
        <Card className="flex-grow flex-shrink-0 basis-[550px] max-w-[600px] p-8 flex flex-col items-start justify-center mx-8 lg:mx-16 xl:mx-24">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 drop-shadow-sm">
            {t("hero.title1", "Discover the World")}
            <br className="hidden md:inline" />
            {t("hero.title2", "with Atlaset")}
          </h1>

          <p className="text-lg md:text-2xl text-muted mb-8 max-w-xl">
            {t(
              "hero.subtitle",
              "Track and visualize your journeys around the world with powerful features and an interactive map experience.",
            )}
          </p>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center md:justify-start">
            <ActionButton
              variant="primary"
              className="px-8 py-3 text-lg font-semibold !rounded-full shadow-md w-full md:w-auto"
              onClick={() => (window.location.href = "/signup")}
            >
              {t("hero.button", "Get Started")}
            </ActionButton>
          </div>
        </Card>
        {/* Hero image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex-grow flex-shrink-0 basis-[900px] w-full max-w-none md:w-[600px] lg:w-[800px] xl:w-[1000px] rounded-2xl flex items-center justify-center overflow-visible me-8 lg:me-16 xl:me-24">
            <img
              src="/assets/hero.svg"
              alt="Atlaset banner"
              className="w-full h-auto object-contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
