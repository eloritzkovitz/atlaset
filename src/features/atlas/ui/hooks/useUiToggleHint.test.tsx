import { act } from "@testing-library/react";
import React, { useState } from "react";
import { useUiToggleHint } from "./useUiToggleHint";
import { renderWithUiHintProviders, setupFakeTimers } from "@test-utils/uiHint";

describe("useUiToggleHint", () => {
  let visibleState: boolean;

  setupFakeTimers();

  function renderWithState(initialVisible: boolean) {
    function Wrapper() {
      const [visible, setUiVisible] = useState(initialVisible);
      visibleState = visible;
      useUiToggleHint(visible, setUiVisible);
      // Update visibleState on each render
      React.useEffect(() => {
        visibleState = visible;
      }, [visible]);
      return null;
    }
    renderWithUiHintProviders(<Wrapper />);
  }

  it("does not toggle on mount", () => {
    renderWithState(false);
    expect(visibleState).toBe(false);
  });

  it("toggles from visible to hidden on 'u' key", () => {
    renderWithState(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "u" }));
    });

    expect(visibleState).toBe(false);
  });

  it("toggles from hidden to visible on 'u' key", () => {
    renderWithState(false);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "u" }));
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
