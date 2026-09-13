import { ICONS } from "@constants/icons";

export const DOCS_CARDS = [
  {
    icon: <ICONS.getStarted className="text-5xl mb-4 text-danger" />,
    title: "Get Started",
    description: "Learn the basics and set up your Atlaset experience.",
    file: "get-started/get-started.md",
  },
  {
    icon: <ICONS.profile className="text-5xl mb-4 text-muted" />,
    title: "Account & Profile",
    description: "Manage your account settings and personalize your profile.",
    file: "get-started/account-profile.md",
  },
  {
    icon: <ICONS.atlas className="text-5xl mb-4 text-info" />,
    title: "Atlas",
    description: "Explore the interactive world map and its features.",
    file: "atlas/atlas-overview.md",
  },
  {
    icon: <ICONS.explore className="text-5xl mb-4 text-warning" />,
    title: "Explore",
    description: "Discover new places and learn about the world.",
    file: "explore/explore-overview.md",
  },
  {
    icon: <ICONS.trips className="text-5xl mb-4 text-status-planned" />,
    title: "Trips",
    description: "Plan, track and relive your journeys and adventures.",
    file: "trips/trips.md",
  },  
  {
    icon: <ICONS.quizzes className="text-5xl mb-4 text-type-abroad" />,
    title: "Quizzes",
    description: "Test your knowledge of the world.",
    file: "quizzes/quizzes.md",
  },
];
