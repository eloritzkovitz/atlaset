import { describe, it, expect, vi } from "vitest";
import {
  parseAndNormalize,
  serializeItems,
  importFromFile,
  exportToFile,
} from "./json";

// Dummy type for testing
type Dummy = {
  id?: string;
  name: string;
  value: number;
  extra?: string;
};

function normalizeDummy(obj: Record<string, unknown>): Dummy {
  return {
    id: typeof obj.id === "string" ? obj.id : "generated",
    name: String(obj.name),
    value: Number(obj.value),
    extra: typeof obj.extra === "string" ? obj.extra : undefined,
  };
}

describe("json utils", () => {
  it("parseAndNormalize parses array and single object", () => {
    const arr = [
      { id: "a", name: "foo", value: 1 },
      { name: "bar", value: 2 },
    ];
    const single = { name: "baz", value: 3 };
    const parsedArr = parseAndNormalize(arr, normalizeDummy);
    const parsedSingle = parseAndNormalize(single, normalizeDummy);
    expect(parsedArr).toHaveLength(2);
    expect(parsedArr[0].name).toBe("foo");
    expect(parsedArr[1].name).toBe("bar");
    expect(parsedSingle).toHaveLength(1);
    expect(parsedSingle[0].name).toBe("baz");
  });

  it("parseAndNormalize parses JSON string", () => {
    const json = '[{"name":"foo","value":1},{"name":"bar","value":2}]';
    const parsed = parseAndNormalize(json, normalizeDummy);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("foo");
    expect(parsed[1].value).toBe(2);
  });

  it("serializeItems omits fields and pretty prints", () => {
    const items: Dummy[] = [
      { id: "a", name: "foo", value: 1, extra: "x" },
      { id: "b", name: "bar", value: 2 },
    ];
    const json = serializeItems(items, ["id", "extra"]);
    expect(json).toContain("foo");
    expect(json).not.toContain("id");
    expect(json).not.toContain("extra");
    expect(json).toContain("bar");
    expect(json).toContain("\n"); // pretty print
  });

  it("importFromFile calls callback with parsed items", async () => {
    // Mock FileReader
    const mockReadAsText = vi.fn();
    const mockFileReader = {
      readAsText: mockReadAsText,
      onload: undefined,
    };
    vi.stubGlobal("FileReader", function () {
      return mockFileReader;
    });
    const event = {
      target: {
        files: [{ name: "dummy.json" }],
        value: "",
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    const callback = vi.fn();
    // Simulate onload
    mockReadAsText.mockImplementation(() => {
      // @ts-ignore
      mockFileReader.onload({
        target: { result: '[{"name":"foo","value":1}]' },
      });
    });
    importFromFile<Dummy>(
      event,
      (json) => parseAndNormalize(json, normalizeDummy),
      callback,
    );
    expect(callback).toHaveBeenCalledWith([
      { id: "generated", name: "foo", value: 1, extra: undefined },
    ]);
    vi.unstubAllGlobals();
  });

  it("exportToFile creates blob and triggers download", () => {
    const items: Dummy[] = [{ id: "a", name: "foo", value: 1 }];
    const mockCreateObjectURL = vi.fn(() => "blob:url");
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();
    vi.stubGlobal("URL", {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });
    vi.stubGlobal("document", {
      createElement: () => ({
        href: "",
        download: "",
        click: mockClick,
      }),
    });
    exportToFile<Dummy>(items, undefined, ["id"], "dummy");
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:url");
    vi.unstubAllGlobals();
  });
});
