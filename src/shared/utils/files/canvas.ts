/**
 * Utility functions for canvas operations.
 */

interface ScaledDimensionsOptions {
  width: number;
  height: number;
  scale?: number;
  maxDimension?: number;
  devicePixelRatio?: number;
}

/**
 * Calculates scaled canvas dimensions adhering to DPR, scale factor, and a maximum side cap.
 * @param options - Options for calculating scaled dimensions.
 * @returns An object containing the scaled width and height.
 */
export function calculateScaledDimensions({
  width,
  height,
  scale = 1,
  maxDimension = 8192,
  devicePixelRatio = typeof window !== "undefined"
    ? window.devicePixelRatio || 1
    : 1,
}: ScaledDimensionsOptions) {
  let canvasW = Math.round(width * devicePixelRatio * scale);
  let canvasH = Math.round(height * devicePixelRatio * scale);

  const maxSide = Math.max(canvasW, canvasH);
  if (maxSide > maxDimension) {
    const factor = maxDimension / maxSide;
    canvasW = Math.round(canvasW * factor);
    canvasH = Math.round(canvasH * factor);
    console.warn(
      `Export capped to ${maxDimension}px max side; output scaled by ${factor.toFixed(2)}`,
    );
  }

  return { width: canvasW, height: canvasH };
}
