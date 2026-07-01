import { getPageButtons } from "./paginationUtils";

describe("getPageButtons", () => {
  it("returns all pages when totalPages <= 7", () => {
    expect(getPageButtons(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageButtons(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("returns compact pagination with ellipsis for large page counts", () => {
    // currentPage near start
    expect(getPageButtons(1, 10)).toEqual([1, 2, 3, "...", 10]);
    // currentPage in middle
    expect(getPageButtons(5, 10)).toEqual([1, "...", 3, 4, 5, 6, 7, "...", 10]);
    // currentPage near end
    expect(getPageButtons(10, 10)).toEqual([1, "...", 8, 9, 10]);
  });

  it("handles edge cases", () => {
    // Only one page
    expect(getPageButtons(1, 1)).toEqual([1]);
    // currentPage out of bounds
    expect(getPageButtons(0, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageButtons(6, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns correct pages for window boundaries", () => {
    expect(getPageButtons(2, 10)).toEqual([1, 2, 3, 4, "...", 10]);
    expect(getPageButtons(9, 10)).toEqual([1, "...", 7, 8, 9, 10]);
  });
});
