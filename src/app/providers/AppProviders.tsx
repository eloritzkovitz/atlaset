import React from "react";
import { AudioProvider } from "@contexts/AudioProvider";
import { TripsProvider } from "@contexts/TripsProvider";
import { UIProvider } from "@contexts/UIProvider";
import { UIHintProvider } from "@contexts/UIHintProvider";
import { SettingsInitializer } from "@features/settings/core/components/SettingsInitializer";
import { AuthListener } from "@features/user/auth/components/AuthListener";

interface AppProvidersProps {
  children: React.ReactNode;
}

/** Wraps the application with necessary context providers. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AudioProvider>
      <TripsProvider>
        <UIProvider>
          <UIHintProvider>
            <AuthListener />
            <SettingsInitializer />
            {children}
          </UIHintProvider>
        </UIProvider>
      </TripsProvider>
    </AudioProvider>
  );
}
