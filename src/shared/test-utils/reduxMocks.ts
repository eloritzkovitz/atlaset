import { vi } from "vitest";
import { useSelector, useDispatch } from "react-redux";

/** Sets up default mocks for Redux hooks to facilitate testing of components and hooks that rely on Redux state and dispatching actions. */
export function setupDefaultReduxMocks() {
  const dispatchMock = vi.fn(() => Promise.resolve());

  vi.mocked(useDispatch).mockReturnValue(
    dispatchMock as unknown as ReturnType<typeof useDispatch>,
  );
  vi.mocked(useSelector).mockImplementation(() => {
    return undefined;
  });

  return { dispatchMock };
}
