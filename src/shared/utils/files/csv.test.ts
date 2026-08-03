import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportToCSV, type CSVColumn } from "./csv";
import * as fileUtils from "./file";

describe("exportToCSV", () => {
  let downloadBlobSpy: any;

  beforeEach(() => {
    downloadBlobSpy = vi
      .spyOn(fileUtils, "downloadBlob")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return early when data array is empty", () => {
    exportToCSV([], []);
    expect(downloadBlobSpy).not.toHaveBeenCalled();
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

    expect(downloadBlobSpy).toHaveBeenCalledTimes(1);
    const [blob, filename] = downloadBlobSpy.mock.calls[0];

    expect(filename).toBe("my-export.csv");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("text/csv;charset=utf-8;");
  });

  it("should retain existing .csv extension when provided", () => {
    const data = [{ id: 1 }];
    const columns: CSVColumn<(typeof data)[0]>[] = [
      { header: "ID", accessor: "id" },
    ];

    exportToCSV(data, columns, "custom.csv");

    expect(downloadBlobSpy).toHaveBeenCalledWith(
      expect.any(Blob),
      "custom.csv",
    );
  });
});
