vi.mock("../../../features/settings/hooks/useLanguage", () => ({
  useLanguage: () => ({
    current: "en",
    name: "English",
    isRtl: false,
    change: vi.fn(),
    toggle: vi.fn(),
  }),
  isRtl: (_lng?: string) => false,
}));

import React from "react";
import "@testing-library/jest-dom";
import { act, fireEvent } from "@testing-library/react";
import { renderWithUiHintProviders, setupFakeTimers } from "@test-utils/uiHint";
import { useUiHint } from "./useUiHint";

function TestComponent({
  message,
  duration,
  options,
}: {
  message: React.ReactNode;
  duration?: number;
  options?: Record<string, any>;
}) {
  useUiHint(message ? { message } : null, duration, {
    key: "test",
    ...(options || {}),
  });
  return null;
}

setupFakeTimers();

describe("useUiHint", () => {
  const renderHint = (
    message: React.ReactNode,
    duration?: number,
    options?: Record<string, any>,
  ) =>
    renderWithUiHintProviders(
      <TestComponent message={message} duration={duration} options={options} />,
    );
  it("renders the hint when message is provided", () => {
    const { getByText } = renderHint("Hello");
    expect(getByText("Hello")).toBeInTheDocument();
  });

  it("does not render when message is falsy", () => {
    const { queryByText } = renderHint(null);
    expect(queryByText("Hello")).not.toBeInTheDocument();
  });

  it("auto-hides after duration", () => {
    const { queryByText } = renderHint("Bye", 1000);
    expect(queryByText("Bye")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(queryByText("Bye")).not.toBeInTheDocument();
  });

  it("does not auto-hide if duration is 0", () => {
    const { getByText } = renderHint("Stay", 0);
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(getByText("Stay")).toBeInTheDocument();
  });

  it("shows again if message changes", () => {
    const { getByText, rerender } = renderHint("First", 1000);
    expect(getByText("First")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    rerender(<TestComponent message="Second" duration={1000} />);
    expect(getByText("Second")).toBeInTheDocument();
  });

  it("applies custom style from options", () => {
    const { getByText } = renderHint("Styled", undefined, {
      style: { color: "red" },
    });
    expect(getByText("Styled")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("renders dismiss button when dismissable and removes hint on click", () => {
    const { getByText, queryByText, getByLabelText } = renderHint(
      "Closable",
      undefined,
      { dismissable: true },
    );
    expect(getByText("Closable")).toBeInTheDocument();
    const btn = getByLabelText("Dismiss");
    act(() => {
      fireEvent.click(btn);
    });
    expect(queryByText("Closable")).not.toBeInTheDocument();
  });
});
