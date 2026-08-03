import { sortItems } from "./sort";

describe("sortItems", () => {
  it("sorts numbers ascending and descending", () => {
    const arr = [5, 2, 9, 1];
    expect(sortItems(arr, (n) => n)).toEqual([1, 2, 5, 9]);
    expect(sortItems(arr, (n) => n, "desc")).toEqual([9, 5, 2, 1]);
  });

  it("sorts objects by a property", () => {
    const arr = [
      { name: "Charlie", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 28 },
    ];
    expect(sortItems(arr, (p) => p.name)).toEqual([
      { name: "Alice", age: 25 },
      { name: "Bob", age: 28 },
      { name: "Charlie", age: 30 },
    ]);
    expect(sortItems(arr, (p) => p.age, "desc")).toEqual([
      { name: "Charlie", age: 30 },
      { name: "Bob", age: 28 },
      { name: "Alice", age: 25 },
    ]);
  });

  it("handles null and undefined values", () => {
    const arr = [3, null, 2, undefined, 1];
    expect(sortItems(arr, (n) => n)).toEqual([1, 2, 3, null, undefined]);
  });

  it("returns a new array and does not mutate the original", () => {
    const arr = [2, 1];
    const sorted = sortItems(arr, (n) => n);
    expect(sorted).toEqual([1, 2]);
    expect(arr).toEqual([2, 1]);
  });
});
