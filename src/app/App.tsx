import { AppBootstrap } from "./AppBootstrap";
import { AppRuntimeBoundary } from "./AppRuntimeBoundary";
import { AppProviders } from "./providers/AppProviders";
import { CookieConsentModal } from "@features/settings/privacy/components/CookieConsentModal";
import { MigrationModal } from "@features/user/migration/components/MigrationModal";
import { UIHintContainer } from "@components";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <AppProviders>
      <AppRuntimeBoundary>
        <AppBootstrap>
          <CookieConsentModal />
          <MigrationModal />
          <UIHintContainer />
          <AppRoutes />
        </AppBootstrap>
      </AppRuntimeBoundary>
    </AppProviders>
  );
}
