import { PwaUpdateUiHint, UIHintContainer } from "@components";
import { CookieConsentModal } from "@features/settings/privacy/components/CookieConsentModal";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes/AppRoutes";

/** Main application component. */
export default function App() {
  return (
    <AppProviders>
      <CookieConsentModal />
      <UIHintContainer />
      <PwaUpdateUiHint />
      <AppRoutes />
    </AppProviders>
  );
}
