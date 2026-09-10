import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { SplashScreen } from "@components";

const TripsPage = lazy(() => import("@features/trips/list/pages/TripsPage"));
const TripDetailsPage = lazy(
  () => import("@features/trips/details/pages/TripDetailsPage"),
);

export default function TripsRoutes() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route index element={<TripsPage />} />
        <Route path=":tripId" element={<TripDetailsPage />} />
      </Routes>
    </Suspense>
  );
}
