import { normalizeMarkers } from "./markers";

describe("normalizeMarkers", () => {
  it("returns undefined for non-array input", () => {
    expect(normalizeMarkers(undefined)).toBeUndefined();
    expect(normalizeMarkers(null as unknown as any[])).toBeUndefined();
    expect(normalizeMarkers(123 as unknown as any[])).toBeUndefined();
  });

  it("normalizes a basic array of partial markers", () => {
    const input = [
      { name: "A", coordinates: [1, 2], color: "red" },
      { id: "foo", name: "B", coordinates: [3, 4], visible: false },
      { name: 123, color: 456, coordinates: undefined },
    ];
    const result = normalizeMarkers(input);
    expect(result).toHaveLength(3);
    expect(result?.[0].id).toBe("shared-marker-0");
    expect(result?.[0].name).toBe("A");
    expect(result?.[0].coordinates).toEqual([1, 2]);
    expect(result?.[0].color).toBe("red");
    expect(result?.[1].id).toBe("foo");
    expect(result?.[1].visible).toBe(false);
    expect(result?.[1].coordinates).toEqual([3, 4]);
    expect(result?.[2].name).toBe("Marker 3");
    expect(result?.[2].color).toBeUndefined();
    expect(result?.[2].coordinates).toEqual([0, 0]);
  });

  it("assigns default id and name if missing", () => {
    const input = [{}, { id: null, name: null }];
    const result = normalizeMarkers(input);
    expect(result?.[0].id).toBe("shared-marker-0");
    expect(result?.[0].name).toBe("Marker 1");
    expect(result?.[1].id).toBe("shared-marker-1");
    expect(result?.[1].name).toBe("Marker 2");
  });

  it("handles undefined or unknown marker entries", () => {
    const input = [undefined, { name: "A" }, null as any];
    const result = normalizeMarkers(input);
    expect(result?.[0].id).toBe("shared-marker-0");
    expect(result?.[1].name).toBe("A");
    expect(result?.[2].id).toBe("shared-marker-2");
  });
});
