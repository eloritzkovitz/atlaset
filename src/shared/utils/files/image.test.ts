import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MockImage } from "@test-utils/mockImage";
import { compressImage } from "./image";

let image: MockImage;

const drawImage = vi.fn();
const toBlob = vi.fn();
const getContext = vi.fn();
const createElement = vi.fn();
const revokeObjectURL = vi.fn();

beforeEach(() => {
  getContext.mockReturnValue({ drawImage });
  toBlob.mockImplementation((callback) => callback(new Blob(["compressed"])));
  createElement.mockReturnValue({
    getContext,
    toBlob,
  });

  vi.stubGlobal(
    "Image",
    class extends MockImage {
      constructor() {
        super();
        image = this;
      }
    },
  );

  vi.stubGlobal("URL", {
    createObjectURL: () => "blob:test",
    revokeObjectURL,
  });

  vi.stubGlobal("document", { createElement });
});

afterEach(() => vi.unstubAllGlobals());

const imageFile = (name = "photo.png") =>
  new File(["image"], name, { type: "image/png" });

const compress = async (
  options?: Parameters<typeof compressImage>[1],
  dimensions?: { width: number; height: number },
) => {
  const promise = compressImage(imageFile(), options);

  if (dimensions) {
    image.naturalWidth = dimensions.width;
    image.naturalHeight = dimensions.height;
  }

  image.onload?.();

  return promise;
};

describe("compressImage", () => {
  it("returns non-image files unchanged", async () => {
    const file = new File(["text"], "test.txt", {
      type: "text/plain",
    });

    expect(await compressImage(file)).toBe(file);
  });

  it("compresses a large image", async () => {
    const result = await compress();

    expect(result).toMatchObject({
      name: "photo.webp",
      type: "image/webp",
    });
    expect(drawImage).toHaveBeenCalledWith(image, 0, 0, 2048, 1024);
    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/webp",
      0.85,
    );
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("keeps small images at their original dimensions", async () => {
    await compress(undefined, { width: 1000, height: 800 });

    expect(drawImage).toHaveBeenCalledWith(image, 0, 0, 1000, 800);
  });

  it("resizes portrait images correctly", async () => {
    await compress(undefined, { width: 2000, height: 4000 });

    expect(drawImage).toHaveBeenCalledWith(image, 0, 0, 1024, 2048);
  });

  it("supports custom options and JPEG output", async () => {
    const result = await compress({
      maxDimension: 1000,
      quality: 0.5,
      outputType: "image/jpeg",
    });

    expect(result).toMatchObject({
      name: "photo.jpg",
      type: "image/jpeg",
    });
    expect(drawImage).toHaveBeenCalledWith(image, 0, 0, 1000, 500);
    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/jpeg",
      0.5,
    );
  });

  it("rejects invalid dimensions and quality", async () => {
    const file = imageFile();

    for (const maxDimension of [0, -1, NaN, Infinity]) {
      await expect(compressImage(file, { maxDimension })).rejects.toThrow(
        "maxDimension must be greater than zero",
      );
    }

    for (const quality of [-0.1, 1.1, NaN, Infinity]) {
      await expect(compressImage(file, { quality })).rejects.toThrow(
        "quality must be between 0 and 1",
      );
    }
  });

  it("accepts quality boundaries", async () => {
    await compress({ quality: 0 });
    await compress({ quality: 1 });

    expect(toBlob).toHaveBeenNthCalledWith(
      1,
      expect.any(Function),
      "image/webp",
      0,
    );
    expect(toBlob).toHaveBeenNthCalledWith(
      2,
      expect.any(Function),
      "image/webp",
      1,
    );
  });

  it("handles image loading errors", async () => {
    const promise = compressImage(imageFile());

    image.onerror?.();

    await expect(promise).rejects.toThrow("Unable to load image");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("handles missing canvas context", async () => {
    getContext.mockReturnValueOnce(null);

    await expect(compress()).rejects.toThrow(
      "Unable to create image processing context",
    );
  });

  it("handles encoding errors", async () => {
    toBlob.mockImplementationOnce((callback) => callback(null));

    await expect(compress()).rejects.toThrow("Unable to encode image");
  });

  it("creates the correct output filename", async () => {
    const promise = compressImage(
      new File(["image"], "my.travel.photo.png", {
        type: "image/png",
      }),
    );

    image.onload?.();

    expect((await promise).name).toBe("my.travel.photo.webp");
  });
});
