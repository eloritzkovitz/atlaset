import { useState } from "react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { act, render, fireEvent, screen } from "@testing-library/react";
import { useAutocomplete } from "./useAutocomplete";

function TestHarness({
  initial = "",
  suggestionProvider,
  onChangeSpy,
  debounceMs = 10,
}: {
  initial?: string;
  suggestionProvider: (input: string) => string[];
  onChangeSpy: (v: string) => void;
  debounceMs?: number;
}) {
  const [value, setValue] = useState(initial);
  const { suggestions, handleKeyDown } = useAutocomplete({
    value,
    onChange: (v: string) => {
      setValue(v);
      onChangeSpy(v);
    },
    suggestionProvider,
    debounceMs,
  });

  return (
    <div>
      <input
        data-testid="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div data-testid="suggestions">{suggestions.join(",")}</div>
    </div>
  );
}

describe("useAutocomplete", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates suggestions after debounce and filters by prefix", async () => {
    const suggestions = ["apple", "banana", "apricot", "berry"];
    const provider = () => suggestions;
    const onChangeSpy = vi.fn();

    render(
      <TestHarness
        initial=""
        suggestionProvider={provider}
        onChangeSpy={onChangeSpy}
        debounceMs={10}
      />,
    );

    const input = screen.getByTestId("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ap" } });

    act(() => {
      vi.advanceTimersByTime(20);
    });
    await Promise.resolve();
    const sug = screen.getByTestId("suggestions");
    expect(sug.textContent).toContain("apple");
    expect(sug.textContent).toContain("apricot");
    expect(sug.textContent).not.toContain("banana");
  });

  it("returns unfiltered suggestions when input contains colon (non-prefix)", async () => {
    const suggestions = ["one", "two", "three"];
    const provider = () => suggestions;
    const onChangeSpy = vi.fn();

    render(
      <TestHarness
        initial="a:rest"
        suggestionProvider={provider}
        onChangeSpy={onChangeSpy}
        debounceMs={10}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(20);
    });
    await Promise.resolve();

    const sug = screen.getByTestId("suggestions");
    expect(sug.textContent).toContain("one");
    expect(sug.textContent).toContain("two");
    expect(sug.textContent).toContain("three");
  });

  it("pressing Enter accepts the top suggestion when typing a prefix", async () => {
    const suggestions = ["apple", "apricot"];
    const provider = () => suggestions;
    const onChangeSpy = vi.fn();

    render(
      <TestHarness
        initial=""
        suggestionProvider={provider}
        onChangeSpy={onChangeSpy}
        debounceMs={10}
      />,
    );

    const input = screen.getByTestId("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "app" } });
    act(() => {
      vi.advanceTimersByTime(20);
    });

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await Promise.resolve();
    expect(onChangeSpy).toHaveBeenCalled();
    const calledWith =
      onChangeSpy.mock.calls[onChangeSpy.mock.calls.length - 1][0];
    expect(calledWith.startsWith("apple")).toBeTruthy();
  });
});
