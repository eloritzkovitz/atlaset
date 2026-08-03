import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadBlob, downloadCanvas } from "./file";

describe("downloadBlob", () => {
  let originalCreateElement: typeof document.createElement;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;
  let mockLink: any;

  beforeEach(() => {
    originalCreateElement = document.createElement;
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;

    URL.createObjectURL = vi.fn(() => "blob:mock-url-string");
    URL.revokeObjectURL = vi.fn();

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === "a") {
        mockLink = {
          href: "",
          download: "",
          click: vi.fn(),
          style: {},
        };
        return mockLink;
      }
      return originalCreateElement.call(document, tagName);
    }) as any;

    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
  });

  it("should trigger standard synchronous download workflow for general files", () => {
    const dummyBlob = new Blob(["hello world"], { type: "text/plain" });

    downloadBlob(dummyBlob, "hello.txt", false);

    expect(URL.createObjectURL).toHaveBeenCalledWith(dummyBlob);
    expect(mockLink.href).toBe("blob:mock-url-string");
    expect(mockLink.download).toBe("hello.txt");

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-string");
  });

  it("should delay DOM detachment and object revocation when isJson is true", () => {
    vi.useFakeTimers();
    const jsonBlob = new Blob(['{"foo":"bar"}'], { type: "application/json" });

    downloadBlob(jsonBlob, "data.json", true);

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();

    expect(document.body.removeChild).not.toHaveBeenCalled();
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-string");

    vi.useRealTimers();
  });

  it("should gracefully trigger download and clean up if document.body is unavailable", () => {
    const originalBody = document.body;
    Object.defineProperty(document, "body", {
      value: null,
      configurable: true,
    });

    const dummyBlob = new Blob(["offline-content"]);

    expect(() => {
      downloadBlob(dummyBlob, "no-body.txt", false);
    }).not.toThrow();

    expect(mockLink.click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-string");

    Object.defineProperty(document, "body", {
      value: originalBody,
      configurable: true,
    });
  });
});

describe("downloadCanvas", () => {
  let originalCreateElement: typeof document.createElement;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;
  let mockLink: any;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    originalCreateElement = document.createElement;
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;

    URL.createObjectURL = vi.fn(() => "blob:mock-url-string");
    URL.revokeObjectURL = vi.fn();

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === "a") {
        mockLink = {
          href: "",
          download: "",
          click: vi.fn(),
          style: {},
        };
        return mockLink;
      }
      return originalCreateElement.call(document, tagName);
    }) as any;

    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);

    mockCanvas = {
      toBlob: vi.fn(),
    } as unknown as HTMLCanvasElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
  });

  it("successfully generates a blob and triggers downloadBlob workflow", async () => {
    const fakeBlob = new Blob(["fake-image-data"], { type: "image/png" });

    mockCanvas.toBlob = vi.fn((callback) => {
      callback(fakeBlob);
    });

    await expect(
      downloadCanvas(mockCanvas, "my-map.png", "png", 0.9),
    ).resolves.toBeUndefined();

    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/png",
      0.9,
    );

    expect(mockLink.download).toBe("my-map.png");
    expect(mockLink.click).toHaveBeenCalled();
  });

  it("rejects with an error if the canvas fails to produce a blob", async () => {
    mockCanvas.toBlob = vi.fn((callback) => {
      callback(null);
    });

    await expect(
      downloadCanvas(mockCanvas, "failed-capture.jpg", "jpeg", 1),
    ).rejects.toThrow("Failed to create jpeg blob");

    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
