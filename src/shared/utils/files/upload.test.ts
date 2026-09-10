import { describe, expect, it } from "vitest";
import { getUploadableFiles } from "./upload";

const file = (type: string) => new File(["file"], "test", { type });

describe("getUploadableFiles", () => {
  const acceptedTypes = new Set(["image/jpeg", "image/png"]);

  it("returns only files with accepted MIME types", () => {
    const files = [file("image/jpeg"), file("image/gif"), file("image/png")];

    expect(getUploadableFiles(files, acceptedTypes, 10)).toEqual([
      files[0],
      files[2],
    ]);
  });

  it("limits files to the available slots", () => {
    const files = [file("image/jpeg"), file("image/png"), file("image/jpeg")];

    expect(getUploadableFiles(files, acceptedTypes, 2)).toEqual([
      files[0],
      files[1],
    ]);
  });

  it("returns an empty array when no slots are available", () => {
    const files = [file("image/jpeg")];

    expect(getUploadableFiles(files, acceptedTypes, 0)).toEqual([]);
  });

  it("returns an empty array for negative available slots", () => {
    const files = [file("image/jpeg")];

    expect(getUploadableFiles(files, acceptedTypes, -1)).toEqual([]);
  });

  it("returns an empty array when there are no files", () => {
    expect(getUploadableFiles([], acceptedTypes, 5)).toEqual([]);
  });
});
