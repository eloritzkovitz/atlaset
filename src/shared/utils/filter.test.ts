import { createSelectFilter, filterBySearch } from "./filter";
import type { FilterOption } from "@types";

describe("createSelectFilter", () => {
  it("creates a select filter config with correct properties", () => {
    const getOptions = (options?: string[]) =>
      (options ?? []).map((v) => ({ label: v, value: v })) as FilterOption[];
    const getValue = (props: any) => props.value;
    const setValue = (props: any, val: string) => {
      props.value = val;
    };

    const filter = createSelectFilter(
      "testKey",
      "Test Label",
      getOptions,
      getValue,
      setValue,
    );

    expect(filter.key).toBe("testKey");
    expect(filter.label).toBe("Test Label");
    expect(filter.type).toBe("select");
    expect(typeof filter.getOptions).toBe("function");
    expect(typeof filter.getValue).toBe("function");
    expect(typeof filter.setValue).toBe("function");
  });

  it("supports a label as a function", () => {
    const labelFn = (param: { name: string }) => `Label: ${param.name}`;
    const filter = createSelectFilter(
      "dynamicKey",
      labelFn,
      () => [],
      () => "",
      () => {},
    );
    expect(typeof filter.label).toBe("function");
    // @ts-expect-no-error
    expect((filter.label as Function)({ name: "foo" })).toBe("Label: foo");
  });

  it("returns a FilterConfig with correct generic types", () => {
    type MyKey = "foo" | "bar";
    const filter = createSelectFilter<number, { x: number }, MyKey>(
      "foo",
      "Label",
      () => [],
      () => "",
      () => {},
    );
    // Type assertions
    const key: MyKey = filter.key;
    expect(key).toBe("foo");
  });
});

describe("filterBySearch", () => {
  it("returns all items if search is empty", () => {
    const items = [{ name: "Alpha" }, { name: "Beta" }];
    expect(filterBySearch(items, "", (i) => i.name)).toEqual(items);
  });

  it("filters items by case-insensitive, accent-insensitive match", () => {
    const items = [{ name: "Café" }, { name: "Cafe" }, { name: "Bar" }];
    expect(filterBySearch(items, "cafe", (i) => i.name)).toEqual([
      { name: "Café" },
      { name: "Cafe" },
    ]);
  });

  it("returns only items that include the search string", () => {
    const items = [{ name: "Alpha" }, { name: "Beta" }, { name: "Gamma" }];
    expect(filterBySearch(items, "Al", (i) => i.name)).toEqual([
      { name: "Alpha" },
    ]);
  });

  it("treats whitespace-only search as empty and returns all items", () => {
    const items = [{ name: "A" }, { name: "B" }];
    expect(filterBySearch(items, "   ", (i) => i.name)).toEqual(items);
  });

  it("returns an empty array if no items match", () => {
    const items = [{ name: "Alpha" }, { name: "Beta" }];
    expect(filterBySearch(items, "Zeta", (i) => i.name)).toEqual([]);
  });

  it("works with fields other than 'name'", () => {
    const items = [{ code: "US" }, { code: "CA" }, { code: "MX" }];
    expect(filterBySearch(items, "C", (i) => i.code)).toEqual([{ code: "CA" }]);
  });

  it("matches multi-word searches across tokens", () => {
    const items = [{ name: "Hello" }, { name: "Hello World" }];
    expect(filterBySearch(items, "hello world", (i) => i.name)).toEqual([
      { name: "Hello World" },
    ]);
  });

  it("supports non-Latin scripts (Hebrew) and Unicode tokenization", () => {
    const items = [
      { name: "תל אביב" },
      { name: "תל-אביב" },
      { name: "ירושלים" },
    ];
    expect(filterBySearch(items, "תל", (i) => i.name)).toEqual([
      { name: "תל אביב" },
      { name: "תל-אביב" },
    ]);
    expect(filterBySearch(items, "תל אביב", (i) => i.name)).toEqual([
      { name: "תל אביב" },
      { name: "תל-אביב" },
    ]);
  });
});
