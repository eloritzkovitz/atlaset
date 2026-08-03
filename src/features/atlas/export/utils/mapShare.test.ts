import { encodeMapData, decodeMapData, getSharedMapUrl } from "./mapShare";

describe("mapShare encode/decode", () => {
  it("encodes and decodes structural permutations (layers, markers, metadata)", () => {
    const d1 = {
      layers: [{ name: "Visited", color: "#123", countries: ["US", "CA"] }],
    };
    const r1 = decodeMapData(encodeMapData(d1));

    expect(r1.layers).toEqual([
      expect.objectContaining({
        name: "Visited",
        color: "#123",
        countries: ["US", "CA"],
        visible: true,
        id: expect.any(String),
      }),
    ]);

    expect([r1.markers, r1.mapName, r1.sharer]).toEqual([
      undefined,
      undefined,
      undefined,
    ]);

    const d2 = {
      layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
      mapName: "My Map",
      sharer: "Alice",
    };
    const r2 = decodeMapData(encodeMapData(d2));
    expect(r2.layers[0].name).toBe("L");
    expect([r2.mapName, r2.sharer]).toEqual(["My Map", "Alice"]);

    const d3 = {
      layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
      markers: [
        { name: "A", isoCode: "US" },
        { name: "B", isoCode: "CA" },
      ],
    };
    const r3 = decodeMapData(encodeMapData(d3));

    expect(r3.markers).toEqual([
      expect.objectContaining({
        name: "A",
        isoCode: "US",
        color: "#ef4444",
        visible: true,
        id: expect.any(String),
      }),
      expect.objectContaining({
        name: "B",
        isoCode: "CA",
        color: "#ef4444",
        visible: true,
        id: expect.any(String),
      }),
    ]);
  });

  it("handles alternative bounds, empty structural sets, and extreme characters", () => {
    expect(
      decodeMapData(
        encodeMapData({
          layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
          markers: [],
        }),
      ).markers,
    ).toBeUndefined();

    const rLayers = decodeMapData(
      encodeMapData({ layers: [], mapName: "Empty" }),
    );
    expect([rLayers.layers, rLayers.mapName]).toEqual([[], "Empty"]);

    const dChars = {
      layers: [{ name: "L|:;=", color: "#fff", countries: ["FR"] }],
      markers: [{ name: "A|,;= %", isoCode: "US" }],
      mapName: "M|=;ap",
      sharer: "Sh|=;arer",
    };
    const rChars = decodeMapData(encodeMapData(dChars));
    expect([
      rChars.layers[0].name,
      rChars.markers?.[0].name,
      rChars.mapName,
      rChars.sharer,
    ]).toEqual(["L|:;=", "A|,;= %", "M|=;ap", "Sh|=;arer"]);
  });

  it("protects against corrupt data strings or layout drift gracefully", () => {
    expect(decodeMapData("notbase64")).toEqual({ layers: [] });

    const code = btoa(["Map", "Sharer", "L:#fff:FR"].join("||"));
    const decoded = decodeMapData(code);
    expect([
      decoded.mapName,
      decoded.sharer,
      decoded.layers[0].name,
      decoded.markers,
    ]).toEqual(["Map", "Sharer", "L", undefined]);
  });

  it("calculates sharing locations seamlessly for various code states", () => {
    const origin = window.location.origin;
    expect(getSharedMapUrl("abc123")).toBe(`${origin}/atlas?map=abc123`);
    expect(getSharedMapUrl("")).toBe(`${origin}/atlas?map=`);

    const realCode = encodeMapData({
      layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
      mapName: "Test",
      sharer: "User",
    });
    const realUrl = getSharedMapUrl(realCode);
    expect(realUrl.startsWith(`${origin}/atlas?map=`)).toBe(true);
    expect(realUrl.includes(realCode)).toBe(true);
  });
});
