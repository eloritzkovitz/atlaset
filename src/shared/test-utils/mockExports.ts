export function makeSvgMockFactory(opts?: {
  viewBox?: string;
  w?: number;
  h?: number;
}) {
  const viewBox = opts?.viewBox ?? "0 0 100 100";
  const w = opts?.w ?? 100;
  const h = opts?.h ?? 100;
  return () =>
    ({
      cloneNode: vi.fn(() => ({
        getAttribute: vi.fn((attr: string) =>
          attr === "viewBox" ? viewBox : null,
        ),
        setAttribute: vi.fn(),
        querySelectorAll: vi.fn(() => []),
        width: { baseVal: { value: w } },
        height: { baseVal: { value: h } },
      })),
      ownerDocument: {
        defaultView: {
          getComputedStyle: vi.fn(() => ({
            getPropertyValue: vi.fn(() => ""),
          })),
        },
      },
    }) as any;
}

export function installCanvasMock(opts?: {
  toBlobNull?: boolean;
  getContextNull?: boolean;
  throwOnDrawImage?: boolean;
}) {
  const orig = document.createElement;
  document.createElement = ((
    tagName: string,
    options?: ElementCreationOptions,
  ) => {
    const el = orig.call(document, tagName, options);
    if (tagName === "canvas") {
      if (opts?.getContextNull) {
        (el as any).getContext = () => null;
      } else {
        (el as any).getContext = () => ({
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
          clearRect: vi.fn(),
          save: vi.fn(),
          restore: vi.fn(),
          fillStyle: "",
          fillRect: vi.fn(),
          drawImage: opts?.throwOnDrawImage
            ? () => {
                throw new Error("drawImage failure");
              }
            : vi.fn(),
        });
      }
      (el as any).toBlob = (cb: any) =>
        cb(opts?.toBlobNull ? null : new Blob());
    }
    return el;
  }) as any;
  return () => {
    document.createElement = orig;
  };
}

export function stubImage(success = true) {
  const Orig = (globalThis as any).Image;
  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_v: string) {
      setTimeout(() => {
        if (success) {
          this.onload && this.onload();
        } else {
          this.onerror && this.onerror();
        }
      }, 0);
    }
    set crossOrigin(_v: string) {}
  }
  (globalThis as any).Image = MockImage;
  return () => {
    (globalThis as any).Image = Orig;
  };
}
