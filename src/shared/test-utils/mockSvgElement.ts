export class MockSvgElement {
  private attributes: Record<string, string> = {};
  public children: MockSvgElement[] = [];
  tagName: string;
  parentNode: MockSvgElement | null = null;
  constructor(tagName: string) {
    this.tagName = tagName;
  }
  setAttribute(name: string, value: string) {
    this.attributes[name] = value;
  }
  getAttribute(name: string) {
    return this.attributes[name];
  }
  removeAttribute(name: string) {
    delete this.attributes[name];
  }
  appendChild(child: MockSvgElement) {
    child.parentNode = this;
    this.children.push(child);
  }
  removeChild(child: MockSvgElement) {
    this.children = this.children.filter((c) => c !== child);
    child.parentNode = null;
  }
  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
  querySelector(selector: string): MockSvgElement | null {
    // Support simple tag selectors and comma-separated lists
    const parts = selector.split(",").map((s) => s.trim());
    // Check self for tag match or special 'rect.background'
    for (const part of parts) {
      if (
        part === "rect.background" &&
        this.tagName === "rect" &&
        this.getAttribute("class") === "background"
      ) {
        return this;
      }
      if (part === this.tagName) return this;
    }
    // Then check children recursively
    for (const child of this.children) {
      const found = child.querySelector(selector);
      if (found) return found;
    }
    return null;
  }
  querySelectorAll(selector: string): MockSvgElement[] {
    let results: MockSvgElement[] = [];
    const parts = selector.split(",").map((s) => s.trim());
    // Check self for any matching part
    for (const part of parts) {
      if (
        part === "rect.background" &&
        this.tagName === "rect" &&
        this.getAttribute("class") === "background"
      ) {
        results.push(this);
        break;
      }
      if (part === this.tagName) {
        results.push(this);
        break;
      }
    }
    // Check children recursively
    for (const child of this.children) {
      results = results.concat(child.querySelectorAll(selector));
    }
    return results;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cloneNode(_deep: boolean) {
    const clone = new MockSvgElement(this.tagName);
    clone.attributes = { ...this.attributes };
    clone.children = this.children.map((child) => {
      const childClone = child.cloneNode(true);
      childClone.parentNode = clone;
      return childClone;
    });
    clone.parentNode = null;
    return clone;
  }
  ownerDocument = {
    defaultView: {
      getComputedStyle: (...args: any[]) => {
        const gcs = (globalThis as any).getComputedStyle;
        if (typeof gcs === "function") return gcs(...args);
        return { getPropertyValue: () => "" } as any;
      },
    },
  };
}
