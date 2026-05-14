interface Feature {
  title: string;
  description: string;
  svgPath: string;
}

const features: Feature[] = [
  {
    title: "Interactive World Map",
    description:
      "Explore a customizable world map with country details, custom lists and filters.",
    svgPath: "/assets/world-map.svg",
  },
  {
    title: "Trips & Timeline",
    description:
      "Plan, track, and reminisce your travels. See your visits and exploration progress across the years.",
    svgPath: "/assets/trips-timeline.svg",
  },
  {
    title: "Custom Maps",
    description:
      "Create, import and export your own maps, with layers and markers.",
    svgPath: "/assets/layers-markers.svg",
  },
  {
    title: "Competitive Quizzes",
    description:
      "Test your knowledge of the world with fun, timed challenges. Reach the leaderbooards!",
    svgPath: "/assets/quizzes.svg",
  },
  {
    title: "Dashboard & Analytics",
    description:
      "Analyze your visits and travels with interactive charts, statistics and achievements.",
    svgPath: "/assets/dashboard.svg",
  },
  {
    title: "Cloud Sync & Offline",
    description:
      "Your data is always available—sync across devices or use it offline.",
    svgPath: "/assets/cloud-sync.svg",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-12 px-0 flex flex-col gap-12">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="w-full max-w-4xl mx-auto h-auto p-12 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4 text-blue-800 dark:text-gray-100">
              {feature.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">
              {feature.description}
            </p>
          </div>
          <div className="flex items-center justify-center md:ms-10 mt-8 md:mt-0">
            <div className="w-64 h-64 rounded-full bg-blue-100 dark:bg-gray-800 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src={feature.svgPath}
                alt={feature.title + " icon"}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
