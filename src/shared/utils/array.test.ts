import { extractUniqueValues } from "./array";

describe("extractUniqueValues", () => {
  it("returns allValues if items is null", () => {
    const all = ["a", "b", "c"];
    expect(extractUniqueValues(null, (x) => x, all)).toEqual(all);
  });

  it("returns allValues if items is undefined", () => {
    const all = [1, 2, 3];
    expect(extractUniqueValues(undefined, (x) => x, all)).toEqual(all);
  });

  it("returns allValues if items is empty", () => {
    const all = [true, false];
    expect(extractUniqueValues([], (x) => x, all)).toEqual(all);
  });

  it("extracts unique single values", () => {
    const items = [{ v: 1 }, { v: 2 }, { v: 1 }];
    const all = [1, 2, 3];
    expect(extractUniqueValues(items, (i) => i.v, all)).toEqual([1, 2]);
  });

  it("extracts unique array values", () => {
    const items = [{ v: [1, 2] }, { v: [2, 3] }];
    const all = [1, 2, 3, 4];
    expect(extractUniqueValues(items, (i) => i.v, all)).toEqual([1, 2, 3]);
  });

  it("ignores undefined values", () => {
    const items = [{ v: 1 }, { v: undefined }, { v: 2 }];
    const all = [1, 2, 3];
    expect(extractUniqueValues(items, (i) => i.v, all)).toEqual([1, 2]);
  });

  it("works with mixed single and array values", () => {
    const items = [{ v: 1 }, { v: [2, 3] }, { v: undefined }];
    const all = [1, 2, 3, 4];
    expect(extractUniqueValues(items, (i) => i.v, all)).toEqual([1, 2, 3]);
  });
});
