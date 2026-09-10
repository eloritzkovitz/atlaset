/** A mock implementation of the Image class for testing purposes. */
export class MockImage {
  naturalWidth = 4000;
  naturalHeight = 2000;

  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_v: string) {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }

  set crossOrigin(_v: string) {}
}
