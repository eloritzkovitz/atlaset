/**
 * Utility functions for download operations.
 */

/**
 * Triggers a download for a given Blob object by creating a temporary anchor element and simulating a click.
 * @param blob - Blob object to download.
 * @param filename - Name of the file to be downloaded.
 * @param isJson - If true, delays the removal of the anchor element and revocation of the object URL to ensure proper download of JSON files.
 */
export function downloadBlob(blob: Blob, filename: string, isJson = false) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  if (!document.body) {
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  document.body.appendChild(a);
  a.click();

  if (isJson) {
    setTimeout(() => {
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } else {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/**
 * Triggers a download for a canvas element as an image file.
 * @param canvas - HTMLCanvasElement to download.
 * @param filename - Name of the file to be downloaded.
 * @param format - Image format for the download.
 * @param quality - Optional quality parameter for image formats that support it. Should be a number between 0 and 1.
 * @returns Promise that resolves when the download is triggered.
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: string = "png",
  quality?: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error(`Failed to create ${format} blob`));
        downloadBlob(blob, filename);
        resolve();
      },
      `image/${format}`,
      quality,
    );
  });
}
