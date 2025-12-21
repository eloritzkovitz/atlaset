import {
  toDropdownOptions,
  flattenOptions,
  isAllowedOption,
  isStringOption,
} from "./dropdown";

describe("isAllowedOption", () => {
  it("returns true for allowed value in array", () => {
    const opt = { value: "foo" };
    expect(isAllowedOption(opt, ["foo", "bar"])).toBe(true);
  });

  it("returns false for value not in allowed array", () => {
    const opt = { value: "baz" };
    expect(isAllowedOption(opt, ["foo", "bar"])).toBe(false);
  });

  it("returns true for allowed value using function", () => {
    const opt = { value: 42 };
    expect(isAllowedOption(opt, (v) => typeof v === "number" && v > 40)).toBe(
      true
    );
  });

  it("returns false for disallowed value using function", () => {
    const opt = { value: 10 };
    expect(isAllowedOption(opt, (v) => typeof v === "number" && v > 40)).toBe(
      false
    );
  });

  it("returns false if value property is missing", () => {
    const opt = {};
    expect(isAllowedOption(opt, ["foo", "bar"])).toBe(false);
  });
});

describe("isStringOption", () => {
  it("returns true if value is a string", () => {
    const opt = { value: "hello" };
    expect(isStringOption(opt)).toBe(true);
  });

  it("returns false if value is not a string", () => {
    const opt = { value: 123 };
    expect(isStringOption(opt)).toBe(false);
  });  
});

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

describe("flattenOptions", () => {
  it("flattens an array of options and option groups", () => {
    const options = [
      { value: "a", label: "A" },
      {
        label: "Group 1",
        options: [
          { value: "b", label: "B" },
          { value: "c", label: "C" },
        ],
      },
      { value: "d", label: "D" },
    ];
    const flattened = flattenOptions(options);
    expect(flattened).toEqual([
      { value: "a", label: "A" },
      { value: "b", label: "B" },
      { value: "c", label: "C" },
      { value: "d", label: "D" },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(flattenOptions([])).toEqual([]);
  });
});
