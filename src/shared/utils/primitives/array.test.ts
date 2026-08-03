import { extractUniqueSorted, extractUniqueValues, mapOptions } from "./array";

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

describe("extractUniqueSorted", () => {
  it("returns a sorted array of unique string values", () => {
    const items = [{ v: "b" }, { v: "a" }, { v: "c" }, { v: "a" }];
    expect(extractUniqueSorted(items, (i) => i.v)).toEqual(["a", "b", "c"]);
  });

  it("ignores undefined values", () => {
    const items = [{ v: "b" }, { v: undefined }, { v: "a" }];
    expect(extractUniqueSorted(items, (i) => i.v)).toEqual(["a", "b"]);
  });

  it("returns an empty array if all values are undefined", () => {
    const items = [{ v: undefined }, { v: undefined }];
    expect(extractUniqueSorted(items, (i) => i.v)).toEqual([]);
  });

  it("works with empty input", () => {
    expect(extractUniqueSorted([], (i) => i as any)).toEqual([]);
  });

  it("sorts values lexicographically", () => {
    const items = [{ v: "z" }, { v: "x" }, { v: "y" }];
    expect(extractUniqueSorted(items, (i) => i.v)).toEqual(["x", "y", "z"]);
  });
});

describe("mapOptions", () => {
  it("maps string array to Option objects", () => {
    const options = ["option1", "option2", "option3"];
    expect(mapOptions(options)).toEqual([
      { value: "option1", label: "Option1" },
      { value: "option2", label: "Option2" },
      { value: "option3", label: "Option3" },
    ]);
  });
});
