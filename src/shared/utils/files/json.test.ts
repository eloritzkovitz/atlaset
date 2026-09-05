import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as downloadModule from "./download";
import {
  parseAndNormalize,
  serializeItems,
  importFromFile,
  exportToFile,
} from "./json";

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
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("parseAndNormalize", () => {
    it("parses array, single object, and JSON string", () => {
      const arr = parseAndNormalize(
        [{ name: "foo", value: 1 }],
        normalizeDummy,
      );
      const single = parseAndNormalize(
        { name: "baz", value: 3 },
        normalizeDummy,
      );
      const jsonStr = parseAndNormalize(
        '[{"name":"bar","value":2}]',
        normalizeDummy,
      );

      expect(arr[0].name).toBe("foo");
      expect(single[0].name).toBe("baz");
      expect(jsonStr[0].name).toBe("bar");
    });
  });

  describe("serializeItems", () => {
    it("serializes single item or array, omitting specified fields", () => {
      const item: Dummy = { id: "a", name: "foo", value: 1, extra: "x" };
      const jsonSingle = serializeItems(item, ["id"]);
      const jsonArray = serializeItems([item], ["id", "extra"]);

      expect(jsonSingle).not.toContain("id");
      expect(jsonSingle).toContain("extra");
      expect(jsonArray).not.toContain("extra");
    });
  });

  describe("importFromFile", () => {
    const createInputEvent = (file?: File) =>
      ({
        target: {
          files: file ? [file] : null,
          value: "test.json",
        },
      }) as unknown as React.ChangeEvent<HTMLInputElement>;

    it("safely exits if no file is selected", async () => {
      const callback = vi.fn();
      await importFromFile(createInputEvent(), vi.fn(), callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it("reads file and invokes callback with parsed items", async () => {
      const file = new File(['[{"name":"foo","value":1}]'], "dummy.json", {
        type: "application/json",
      });
      const event = createInputEvent(file);
      const callback = vi.fn();

      await importFromFile<Dummy>(
        event,
        (json) => parseAndNormalize(json, normalizeDummy),
        callback,
      );

      expect(callback).toHaveBeenCalledWith([
        { id: "generated", name: "foo", value: 1, extra: undefined },
      ]);
      expect(event.target.value).toBe("");
    });

    it("handles parsing errors via custom onError callback or fallback logging", async () => {
      const badFile = new File(["invalid json"], "bad.json", {
        type: "application/json",
      });
      const onError = vi.fn();
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await importFromFile(
        createInputEvent(badFile),
        JSON.parse,
        vi.fn(),
        onError,
      );
      expect(onError).toHaveBeenCalledWith(expect.any(Error));

      await importFromFile(createInputEvent(badFile), JSON.parse, vi.fn());
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe("exportToFile", () => {
    it("safely exits if items are falsy", () => {
      const downloadSpy = vi
        .spyOn(downloadModule, "downloadBlob")
        .mockImplementation(() => {});
      exportToFile(null as unknown as Dummy[], "test.json");
      expect(downloadSpy).not.toHaveBeenCalled();
    });

    it("exports items with custom filename, single item default name, or fallback plural name", () => {
      const downloadSpy = vi
        .spyOn(downloadModule, "downloadBlob")
        .mockImplementation(() => {});

      exportToFile<Dummy>([{ name: "foo", value: 1 }], "custom.json");
      expect(downloadSpy).toHaveBeenLastCalledWith(
        expect.any(Blob),
        "custom.json",
        true,
      );

      exportToFile<Dummy>(
        { name: "single", value: 1 },
        undefined,
        ["id"],
        "item",
      );
      expect(downloadSpy).toHaveBeenLastCalledWith(
        expect.any(Blob),
        "single.json",
        true,
      );

      exportToFile<Dummy>(
        [{ value: 1 }, { value: 2 }] as unknown as Dummy[],
        undefined,
        [],
        "layer",
      );
      expect(downloadSpy).toHaveBeenLastCalledWith(
        expect.any(Blob),
        "layers.json",
        true,
      );
    });
  });
});
