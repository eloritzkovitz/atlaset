import React from "react";
import { SettingsInitializer } from "@features/settings/core/components/SettingsInitializer";
import { TripsProvider } from "@features/trips/context/TripsProvider";
import { AuthListener } from "@features/user/auth/components/AuthListener";
import { AudioProvider } from "../contexts/AudioProvider";
import { UIHintProvider } from "../contexts/UIHintProvider";
import { UIProvider } from "../contexts/UIProvider";

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
