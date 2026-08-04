import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes/AppRoutes";

/** Main application component. */
export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
