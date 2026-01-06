import { Navigate } from "react-router-dom";
import { ActionButton, LoadingSpinner } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { Footer, PublicHeader } from "@layout";

export default function HomePage() {
  const { user, loading } = useAuth();

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
    <div className="h-screen w-full bg-bg overflow-y-auto py-0">
      <PublicHeader showButtons />
      <main>
        {/* Hero Section */}
        <section className="flex items-center justify-center py-16 px-4">
          <div className="flex w-full max-w-[2000px] gap-8 items-stretch">
            <div className="flex-grow flex-shrink-0 basis-[550px] max-w-[600px] p-8 flex flex-col items-start justify-center mx-8 lg:mx-16 xl:mx-24 bg-white/90 dark:bg-gray-900/80">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-white drop-shadow-sm">
                Discover the World
                <br className="hidden md:inline" /> with Atlaset
              </h1>
              <p className="text-lg md:text-2xl text-muted mb-8 max-w-xl">
                Track and visualize your journeys around the world with powerful
                features and an interactive map experience.
              </p>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center md:justify-start">
                <ActionButton
                  variant="primary"
                  className="px-8 py-3 text-lg font-semibold rounded-xl shadow-md w-full md:w-auto"
                  onClick={() => (window.location.href = "/signup")}
                >
                  Get Started
                </ActionButton>
              </div>
            </div>
            {/* Right: Hero image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex-grow flex-shrink-0 basis-[900px] w-full max-w-none md:w-[600px] lg:w-[800px] xl:w-[1000px] rounded-2xl flex items-center justify-center overflow-visible mr-8 lg:mr-16 xl:mr-24">
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

        {/* Features Section */}
        <section className="w-full py-12 px-0 flex flex-col gap-12">
          <FeatureCard
            title="Interactive World Map"
            description="Explore a customizable world map with country details, overlays, and filters."
            svgPath="/assets/world-map.svg"
          />
          <FeatureCard
            title="Trips & Timeline"
            description="Plan, track, and reminisce your travels. See your visits and exploration progress across the years."
            svgPath="/assets/trips-timeline.svg"
          />
          <FeatureCard
            title="Custom Layers & Markers"
            description="Create, import, and export your own map layers and markers for any location."
            svgPath="/assets/layers-markers.svg"
          />
          <FeatureCard
            title="Competitive Quizzes"
            description="Test your knowledge of the world with fun, timed challenges and leaderboards."
            svgPath="/assets/quizzes.svg"
          />
          <FeatureCard
            title="Dashboard & Analytics"
            description="Analyze your visits and travels with interactive statistics and charts."
            svgPath="/assets/dashboard.svg"
          />
          <FeatureCard
            title="Cloud Sync & Offline"
            description="Your data is always available—sync across devices or use it offline."
            svgPath="/assets/cloud-sync.svg"
          />
        </section>

        {/* Call to Action Section */}
        <section
          className="w-full relative flex flex-col items-center justify-center py-20 px-0"
          style={{
            backgroundImage: "url(/assets/action.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white drop-shadow-sm">
              Ready to explore? Join Atlaset and start your journey today
            </h2>
            <ActionButton
              variant="primary"
              className="px-8 py-3 text-lg font-semibold rounded-xl shadow-md w-full md:w-auto"
              onClick={() => (window.location.href = "/signup")}
            >
              Get Started
            </ActionButton>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );

  // FeatureCard component for homepage features
  function FeatureCard({
    title,
    description,
    svgPath,
  }: {
    title: string;
    description: string;
    svgPath: string;
  }) {
    return (
      <div className="w-full max-w-4xl mx-auto h-auto p-12 flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-4 text-blue-800 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-center md:ml-10 mt-8 md:mt-0">
          <div className="w-64 h-64 rounded-full bg-blue-100 dark:bg-gray-800 flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src={svgPath}
              alt={title + " icon"}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
