import { toDropdownOptions } from "./dropdown";

describe("toDropdownOptions", () => {
  it("converts string array to dropdown options with default labelFn", () => {
    const values = ["foo", "bar-baz"];
    const options = toDropdownOptions(values, (v) => v);
    expect(options).toEqual([
      { value: "foo", label: "Foo" },
      { value: "bar-baz", label: "Bar Baz" },
    ]);
  });

  it("uses custom labelFn if provided", () => {
    const values = ["a", "b"];
    const options = toDropdownOptions(
      values,
      (v) => v,
      (v) => v.toUpperCase()
    );
    expect(options).toEqual([
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(toDropdownOptions([], (v) => v)).toEqual([]);
  });

  it("works with object arrays", () => {
    const items = [
      { code: "us", name: "United States" },
      { code: "ca", name: "Canada" },
    ];
    const options = toDropdownOptions(
      items,
      (i) => i.code,
      (i) => i.name
    );
    expect(options).toEqual([
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
    ]);
  });
});
