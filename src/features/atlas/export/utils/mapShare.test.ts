import { encodeMapData, decodeMapData, getSharedMapUrl } from "./mapShare";

describe("mapShare encode/decode", () => {
  it("encodes and decodes minimal layers", () => {
    const data = {
      layers: [{ name: "Visited", color: "#123", countries: ["US", "CA"] }],
    };
    const code = encodeMapData(data);
    const decoded = decodeMapData(code);
    expect(decoded.layers).toEqual(data.layers);
    expect(decoded.markers).toBeUndefined();
    expect(decoded.mapName).toBeUndefined();
    expect(decoded.sharer).toBeUndefined();
  });

  it("encodes and decodes with mapName and sharer", () => {
    const data = {
      layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
      mapName: "My Map",
      sharer: "Alice",
    };
    const code = encodeMapData(data);
    const decoded = decodeMapData(code);
    expect(decoded.layers).toEqual(data.layers);
    expect(decoded.mapName).toBe("My Map");
    expect(decoded.sharer).toBe("Alice");
  });

  it("encodes and decodes with markers", () => {
    const data = {
      layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
      markers: [
        { name: "A", coordinates: [2, 1] as [number, number] },
        { coordinates: [4, 3] as [number, number] },
      ],
    };
    const code = encodeMapData(data);
    const decoded = decodeMapData(code);
    expect(decoded.layers).toEqual(data.layers);
    expect(decoded.markers).toEqual([
      {
        name: "A",
        coordinates: [2, 1],
        color: undefined,
        description: undefined,
      },
      {
        name: undefined,
        coordinates: [4, 3],
        color: undefined,
        description: undefined,
      },
    ]);
  });

  it("handles empty markers array", () => {
    const data = {
      layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
      markers: [],
    };
    const code = encodeMapData(data);
    const decoded = decodeMapData(code);
    expect(decoded.markers).toBeUndefined();
  });

  it("handles empty layers array", () => {
    const data = {
      layers: [],
      mapName: "Empty",
    };
    const code = encodeMapData(data);
    const decoded = decodeMapData(code);
    expect(decoded.layers).toEqual([]);
    expect(decoded.mapName).toBe("Empty");
  });

  it("handles special characters in names and labels", () => {
    const data = {
      layers: [{ name: "L|:;=", color: "#fff", countries: ["FR"] }],
      markers: [{ name: "A|,;= %", coordinates: [2, 1] as [number, number] }],
      mapName: "M|=;ap",
      sharer: "Sh|=;arer",
    };
    const code = encodeMapData(data);
    const decoded = decodeMapData(code);
    expect(decoded.layers[0].name).toBe("L|:;=");
    expect(decoded.markers?.[0].name).toBe("A|,;= %");
    expect(decoded.mapName).toBe("M|=;ap");
    expect(decoded.sharer).toBe("Sh|=;arer");
  });

  it("returns empty layers on invalid input", () => {
    expect(decodeMapData("notbase64")).toEqual({ layers: [] });
  });

  it("is robust to missing or extra parts", () => {
    // Simulate a code with missing marker part
    const code = btoa(["Map", "Sharer", "L:#fff:FR"].join("||"));
    const decoded = decodeMapData(code);
    expect(decoded.mapName).toBe("Map");
    expect(decoded.sharer).toBe("Sharer");
    expect(decoded.layers[0].name).toBe("L");
    expect(decoded.markers).toBeUndefined();
  });

  it("getSharedMapUrl returns correct URL for code", () => {
    const code = "abc123";
    const url = getSharedMapUrl(code);
    expect(url).toBe(`${window.location.origin}/atlas?map=abc123`);
  });

  it("getSharedMapUrl works with empty code", () => {
    const url = getSharedMapUrl("");
    expect(url).toBe(`${window.location.origin}/atlas?map=`);
  });

  it("getSharedMapUrl returns a valid URL for a real encoded map", () => {
    const data = {
      layers: [{ name: "L", color: "#fff", countries: ["FR"] }],
      mapName: "Test",
      sharer: "User",
    };
    const code = encodeMapData(data);
    const url = getSharedMapUrl(code);
    expect(url.startsWith(`${window.location.origin}/atlas?map=`)).toBe(true);
    expect(url.includes(code)).toBe(true);
  });
});
