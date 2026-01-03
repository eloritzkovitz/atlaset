import { beforeAll } from "vitest";

beforeAll(() => {
  process.on("unhandledRejection", () => {});
});
import { vi } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const configureStore = require("redux-mock-store").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const thunk = require("redux-thunk").thunk;
import { fetchCountryData } from "./countryDataSlice";
import { mockCountries } from "../../../shared/test-utils/mockCountries";

describe("countryDataSlice async thunk", () => {
    it("dispatches rejected on thrown non-Error value", async () => {
      (global.fetch as any)
        .mockRejectedValueOnce(42) // first fetch throws a number (not Error or string)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // second fetch dummy
      try {
        await store.dispatch(fetchCountryData());
      } catch (e) {
        // ignore, we assert on actions
      }
      const actions = store.getActions();
      expect(actions[0].type).toBe(fetchCountryData.pending.type);
      expect(actions[1].type).toBe(fetchCountryData.rejected.type);
      expect(actions[1].error.message).toBe("Failed to load data");
    });
  const middlewares = [thunk as any];
  const mockStore = configureStore(middlewares);
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({ countryData: undefined });
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches fulfilled on successful fetch", async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => mockCountries })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          USD: "United States Dollar",
          CAD: "Canadian Dollar",
        }),
      });

    try {
      await store.dispatch(fetchCountryData());
    } catch (e) {
      // ignore, we assert on actions
    }
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchCountryData.pending.type);
    expect(actions[1].type).toBe(fetchCountryData.fulfilled.type);
    expect(actions[1].payload.countries).toEqual(mockCountries);
  });

  it("dispatches rejected on fetch error", async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: false }) // first fetch fails
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // second fetch dummy
    try {
      await store.dispatch(fetchCountryData());
    } catch (e) {
      // ignore, we assert on actions
    }
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchCountryData.pending.type);
    expect(actions[1].type).toBe(fetchCountryData.rejected.type);
    expect(actions[1].error.message).toMatch(/Failed to load country data/);
  });

  it("dispatches rejected on thrown error", async () => {
    (global.fetch as any)
      .mockRejectedValueOnce(new Error("network fail")) // first fetch throws
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // second fetch dummy
    try {
      await store.dispatch(fetchCountryData());
    } catch (e) {
      // ignore, we assert on actions
    }
    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchCountryData.pending.type);
    expect(actions[1].type).toBe(fetchCountryData.rejected.type);
    expect(actions[1].error.message).toBe("network fail");
  });
});
