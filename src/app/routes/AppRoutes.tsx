import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { SplashScreen } from "@components";
import { AtlasProviders } from "@features/atlas/core/providers/AtlasProviders";
import { SettingsRoutes } from "@features/settings/core/routes/SettingsRoutes";
import { GuestRoute } from "./GuestRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/app/AppLayout";
import { PublicLayout } from "../layouts/public/PublicLayout";
import AboutPage from "../pages/AboutPage";
import ActivityPage from "@features/activity/pages/ActivityPage";
import ChangelogPage from "../pages/ChangelogPage";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "@features/user/auth/pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import ProfilePage from "@features/user/profile/pages/ProfilePage";
import SearchPage from "@features/search/pages/SearchPage";
import SignupPage from "@features/user/auth/pages/SignupPage";

const DocsPage = lazy(() => import("@features/docs/pages/DocsPage"));
const DashboardPage = lazy(
  () => import("@features/dashboard/core/pages/DashboardPage"),
);
const ExplorePage = lazy(
  () => import("@features/explore/core/pages/ExplorePage"),
);
const QuizzesPage = lazy(
  () => import("@features/quizzes/core/pages/QuizzesPage"),
);
const TripsPage = lazy(() => import("@features/trips/pages/TripsPage"));

/** Main application routes component. */
export function AppRoutes() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        {/* Guest-only routes (redirect signed-in users to /atlas) */}
        <Route element={<GuestRoute redirectTo="/atlas" />}>
          <Route element={<PublicLayout showAuthButtons />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>

        {/* Standard public informational routes */}
        <Route element={<PublicLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Route>

        {/* Protected application routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/explore/*" element={<ExplorePage />} />
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/settings/*" element={<SettingsRoutes />} />
            <Route path="/users/:username/*" element={<ProfilePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
        </Route>

        {/* Unprotected application Routes */}
        <Route element={<AppLayout />}>
          <Route path="/quizzes/*" element={<QuizzesPage />} />
        </Route>
        <Route path="/docs/*" element={<DocsPage />} />
        <Route path="/atlas" element={<AtlasProviders />} />

        {/* Catch-all route */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          }
        />
      </Routes>
    </Suspense>
  );
}
