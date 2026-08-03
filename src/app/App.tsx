import { AppRoutes } from "./AppRoutes";
import { AppProviders } from "./providers/AppProviders";

/** Main application component. */
export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
