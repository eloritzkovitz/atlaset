import { AppContent } from "./AppContent";
import { AppProviders } from "./AppProviders";

/** Main application component. */
export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
