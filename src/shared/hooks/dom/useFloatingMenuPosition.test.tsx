import { useRef } from "react";
import { render } from "@testing-library/react";
import { useFloatingMenuPosition } from "./useFloatingMenuPosition";

interface SetupTestArgs {
  mainRect: { left: number; right: number; top: number };
  floatingWidth?: number;
  floatingHeight?: number;
  windowWidth?: number;
  windowHeight?: number;
  defaultLeft?: number;
  defaultTop?: number;
}

function setupTest({
  mainRect,
  floatingWidth = 180,
  floatingHeight = 300,
  windowWidth = 1200,
  windowHeight = 800,
  defaultLeft = 0,
  defaultTop = 0,
}: SetupTestArgs) {
  // Mock window sizes
  Object.defineProperty(window, "innerWidth", {
    value: windowWidth,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: windowHeight,
    configurable: true,
  });

  // Create fake DOM nodes
  const mainMenu = {
    getBoundingClientRect: () => mainRect,
  } as any;
  const floatingMenu = {
    offsetWidth: floatingWidth,
    offsetHeight: floatingHeight,
  } as any;

  // Hook test component
  function TestComponent() {
    const mainRef = useRef<any>(mainMenu);
    const floatingRef = useRef<any>(floatingMenu);
    const pos = useFloatingMenuPosition(
      mainRef,
      floatingRef,
      defaultLeft,
      defaultTop,
    );
    return <div data-testid="pos">{JSON.stringify(pos)}</div>;
  }

  const utils = render(<TestComponent />);
  return utils;
}

describe("useFloatingMenuPosition", () => {
  it("positions to the right if enough space", () => {
    const mainRect = { left: 100, right: 200, top: 50 };
    const { getByTestId } = setupTest({ mainRect });
    expect(getByTestId("pos").textContent).toContain(`"left":200`);
    expect(getByTestId("pos").textContent).toContain(`"top":50`);
  });

  it("positions to the left if not enough space on right", () => {
    const mainRect = { left: 1000, right: 1100, top: 50 };
    const { getByTestId } = setupTest({
      mainRect,
      windowWidth: 1200,
      floatingWidth: 180,
    });
    expect(getByTestId("pos").textContent).toContain(`"left":820`);
  });

  it("adjusts top if bottom would overflow", () => {
    const mainRect = { left: 100, right: 200, top: 700 };
    const { getByTestId } = setupTest({
      mainRect,
      windowHeight: 800,
      floatingHeight: 300,
    });
    expect(getByTestId("pos").textContent).toContain(`"top":492`);
  });

  it("adjusts top if top would overflow", () => {
    const mainRect = { left: 100, right: 200, top: 0 };
    const { getByTestId } = setupTest({ mainRect });
    expect(getByTestId("pos").textContent).toContain(`"top":8`);
  });

  it("returns default position if refs are missing", () => {
    function TestComponent() {
      const mainRef = useRef<any>(null);
      const floatingRef = useRef<any>(null);
      const pos = useFloatingMenuPosition(mainRef, floatingRef, 42, 99);
      return <div data-testid="pos">{JSON.stringify(pos)}</div>;
    }
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("pos").textContent).toBe(
      JSON.stringify({ left: 42, top: 99 }),
    );
  });
});
