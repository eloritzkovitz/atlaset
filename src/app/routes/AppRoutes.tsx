import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PwaUpdateUiHint, SplashScreen, UIHintContainer } from "@components";
import { AtlasProviders } from "@features/atlas/core/providers/AtlasProviders";
import { CookieConsentModal, useAnalytics } from "@features/settings";
import { SettingsRoutes } from "@features/settings/common/routes/SettingsRoutes";
import { GuestRoute } from "./GuestRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/app/AppLayout";
import { PublicLayout } from "../layouts/public/PublicLayout";
import AboutPage from "../../pages/AboutPage";
import ActivityPage from "../../pages/ActivityPage";
import ChangelogPage from "../../pages/ChangelogPage";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import NotFoundPage from "../../pages/NotFoundPage";
import PrivacyPolicyPage from "../../pages/PrivacyPolicyPage";
import ProfilePage from "../../pages/ProfilePage";
import SearchPage from "../../pages/SearchPage";
import SignupPage from "../../pages/SignupPage";

const DocsPage = lazy(() => import("../../pages/DocsPage"));
const DashboardPage = lazy(() => import("../../pages/DashboardPage"));
const QuizzesPage = lazy(() => import("../../pages/QuizzesPage"));
const TripsPage = lazy(() => import("../../pages/TripsPage"));

/** Main application routes component. */
export function AppRoutes() {
  useAnalytics();

  return (
    <>
      <CookieConsentModal />
      <UIHintContainer />
      <PwaUpdateUiHint />

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
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Protected application routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
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
        </Routes>
      </Suspense>
    </>
  );
}
