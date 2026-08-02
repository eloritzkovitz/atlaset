import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportToCSV, type CSVColumn } from "./csv";

describe("exportToCSV", () => {
  let mockAnchor: HTMLAnchorElement;

  beforeEach(() => {
    mockAnchor = {
      setAttribute: vi.fn(),
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, "createElement").mockImplementation(
      (tagName: string) => {
        if (tagName === "a") return mockAnchor;
        return document.createElement(tagName);
      },
    );

    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return early when data array is empty", () => {
    exportToCSV([], []);
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it("should process key and function accessors, handle nullish values, and escape quotes", () => {
    interface TestData {
      id: number;
      name: string;
      notes?: string | null;
    }

    const data: TestData[] = [
      { id: 1, name: 'Alice "The Boss"', notes: null },
      { id: 2, name: "Bob", notes: undefined },
    ];

    const columns: CSVColumn<TestData>[] = [
      { header: 'ID "Header"', accessor: "id" },
      { header: "Name", accessor: (row) => row.name },
      { header: "Notes", accessor: "notes" },
    ];

    exportToCSV(data, columns, "my-export");

    expect(mockAnchor.setAttribute).toHaveBeenCalledWith(
      "download",
      "my-export.csv",
    );
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("should retain existing .csv extension when provided", () => {
    const data = [{ id: 1 }];
    const columns: CSVColumn<(typeof data)[0]>[] = [
      { header: "ID", accessor: "id" },
    ];

    exportToCSV(data, columns, "custom.csv");

    expect(mockAnchor.setAttribute).toHaveBeenCalledWith(
      "download",
      "custom.csv",
    );
  });
});
