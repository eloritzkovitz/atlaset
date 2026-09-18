import { Component, type ReactNode } from "react";
import { SplashScreen } from "@components";

interface AppRuntimeBoundaryProps {
  children: ReactNode;
}

interface AppRuntimeBoundaryState {
  hasError: boolean;
}

const CHUNK_RELOAD_KEY = "atlaset:chunk-reload";

/** Checks if an error is a chunk load error. */
function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Failed to fetch dynamically imported module") ||
    error.message.includes("Importing a module script failed") ||
    error.message.includes("error loading dynamically imported module")
  );
}

/** Catches application runtime errors and recovers from stale chunk errors. */
export class AppRuntimeBoundary extends Component<
  AppRuntimeBoundaryProps,
  AppRuntimeBoundaryState
> {
  state: AppRuntimeBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppRuntimeBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error): void {
    if (!isChunkLoadError(error)) {
      return;
    }

    const hasReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY);

    if (hasReloaded) {
      return;
    }

    sessionStorage.setItem(CHUNK_RELOAD_KEY, "true");
    window.location.reload();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <SplashScreen />;
    }

    return this.props.children;
  }
}
