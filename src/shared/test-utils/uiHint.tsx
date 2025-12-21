import React from "react";
import { UIHintProvider } from "@contexts/UIHintProvider";
import { UIHintContainer } from "@components/ui/UiHint/UiHintContainer";
import { render } from "@testing-library/react";

export const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <UIHintProvider>
    <UIHintContainer />
    {children}
  </UIHintProvider>
);

export function renderWithUiHintProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: AllProviders });
}

export function setupFakeTimers() {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
}