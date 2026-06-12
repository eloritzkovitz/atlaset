import { useTranslation } from "react-i18next";

interface Feature {
  id: string;
  svgPath: string;
}

const featuresConfig: Feature[] = [
  { id: "worldMap", svgPath: "/assets/world-map.svg" },
  { id: "timeline", svgPath: "/assets/trips-timeline.svg" },
  { id: "customMaps", svgPath: "/assets/layers-markers.svg" },
  { id: "quizzes", svgPath: "/assets/quizzes.svg" },
  { id: "analytics", svgPath: "/assets/dashboard.svg" },
  { id: "cloudSync", svgPath: "/assets/cloud-sync.svg" },
];

export function FeaturesSection() {
  const { t } = useTranslation("home");

  return (
    <section className="w-full py-12 px-0 flex flex-col gap-12">
      {featuresConfig.map((feature) => {
        const titleKey = `features.${feature.id}.title`;
        const descKey = `features.${feature.id}.description`;

        return (
          <div
            key={feature.id}
            className="w-full max-w-4xl mx-auto h-auto p-12 flex flex-col md:flex-row items-center justify-between"
          >
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4 text-blue-800 dark:text-gray-100">
                {t(titleKey)}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">
                {t(descKey)}
              </p>
            </div>
            <div className="flex items-center justify-center md:ms-10 mt-8 md:mt-0">
              <div className="w-64 h-64 rounded-full bg-blue-100 dark:bg-gray-800 flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={feature.svgPath}
                  alt={t(titleKey)}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
