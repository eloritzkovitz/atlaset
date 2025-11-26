import { act } from "@testing-library/react";
import React, { useState } from "react";
import { UIContext } from "@contexts/UIContext";
import { useUiToggleHint } from "./useUiToggleHint";
import { renderWithUiHintProviders, setupFakeTimers } from "@test-utils/uiHint";
import { mockUIContext } from "@test-utils/mockUIContext";

describe("useUiToggleHint", () => {
  let visibleState: boolean;
  let setUiVisible: React.Dispatch<React.SetStateAction<boolean>>;

  setupFakeTimers();

  function renderWithState(initialVisible: boolean) {
    function UiProvider({ children }: { children: React.ReactNode }) {
      const [uiVisible, _setUiVisible] = useState(initialVisible);
      visibleState = uiVisible;
      setUiVisible = _setUiVisible;
      // Provide all other mock context values, but override uiVisible/setUiVisible
      return (
        <UIContext.Provider
          value={{ ...mockUIContext, uiVisible, setUiVisible: _setUiVisible }}
        >
          {children}
        </UIContext.Provider>
      );
    }

    function Wrapper() {
      useUiToggleHint();
      return null;
    }

    renderWithUiHintProviders(
      <UiProvider>
        <Wrapper />
      </UiProvider>
    );
  }

  it("does not toggle on mount", () => {
    renderWithState(false);
    expect(visibleState).toBe(false);
  });

  it("toggles from visible to hidden", () => {
    renderWithState(true);

    act(() => {
      setUiVisible((v) => !v);
    });

    expect(visibleState).toBe(false);
  });

  it("toggles from hidden to visible", () => {
    renderWithState(false);

    act(() => {
      setUiVisible((v) => !v);
    });

    expect(visibleState).toBe(true);
  });

  it("does not toggle when typing in input", () => {
    renderWithState(true);

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    Object.defineProperty(document, "activeElement", {
      configurable: true,
      get: () => input,
    });

    act(() => {
      input.dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "u", bubbles: true })
      );
    });

    expect(visibleState).toBe(true);

    document.body.removeChild(input);
  });

  it("does not toggle on irrelevant key", () => {
    renderWithState(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
    });

    expect(visibleState).toBe(true);
  });
});
