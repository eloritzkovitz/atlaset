import { useState, useEffect } from "react";
import { ActionButton } from "@components";
import type { ImageFormat } from "../types";

type ImageOptionsProps = {
  format: ImageFormat;
  scaleOptions: number[];
  onOptionsChange: (opts: { scale: number; quality: number; backgroundColor?: string }) => void;
};

export function ImageOptions({
  format,
  scaleOptions,
  onOptionsChange,
}: ImageOptionsProps) {
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(5);
  const qualityFloat = quality * 0.2;  
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  // Notify parent of option changes
  useEffect(() => {
    onOptionsChange({
      scale,
      quality: qualityFloat,
      ...(format === "jpeg" ? { backgroundColor } : {}),
    });
  }, [scale, quality, backgroundColor, format, onOptionsChange]);

  return (
    <div>
      <div className="text-xs mb-1 text-gray-500 dark:text-gray-400">Scale</div>
      <div className="flex gap-2 mb-4">
        {scaleOptions.map((s) => (
          <ActionButton
            key={s}
            onClick={() => setScale(s)}
            className={`scale-btn ${scale === s ? "scale-btn-active" : ""}`}
            ariaLabel={`Scale ${s}x`}
            title={`${s}x`}
          >
            {s}x
          </ActionButton>
        ))}
      </div>
      {(format === "jpeg" || format === "webp") && (
        <div className="mb-2">
          <label htmlFor="image-quality-slider" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            Quality
          </label>
          <input
            id="image-quality-slider"
            type="range"
            min={1}
            max={5}
            step={1}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="align-middle"
          />
          <span className="ml-2 text-xs">
            {quality} <span className="text-gray-400"></span>
          </span>
        </div>
      )}
      {format === "jpeg" && (
        <div className="mb-2">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={e => setBackgroundColor(e.target.value)}
            className="w-8 h-8 p-0 border-0"
          />
        </div>
      )}
    </div>
  );
}
