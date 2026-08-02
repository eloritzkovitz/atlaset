/**
 * Utility functions to interact with the clipboard.
 */

/**
 * Copies the given text to the clipboard using the Clipboard API.
 * @param text - The text to be copied to the clipboard.
 * @returns A promise that resolves to true if the text was successfully copied, or false if an error occurred.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}
