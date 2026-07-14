import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, ColorSelectInput } from "@components";
import type { ImageFormat } from "../../types";

type ImageOptionsProps = {
  format: ImageFormat;
  scaleOptions: number[];
  onOptionsChange: (opts: {
    scale: number;
    quality: number;
    backgroundColor?: string;
  }) => void;
};

export function ImageOptions({
  format,
  scaleOptions,
  onOptionsChange,
}: ImageOptionsProps) {
  const { t } = useTranslation("atlas");

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
  }, [scale, quality, qualityFloat, backgroundColor, format, onOptionsChange]);

  return (
    <div>
      <div className="text-xs text-muted mb-1">
        {t("mapExport.download.imageOptions.scale")}
      </div>
      <div className="flex gap-2 mb-4">
        {scaleOptions.map((s) => (
          <ActionButton
            key={s}
            onClick={() => setScale(s)}
            className={`px-2 py-1 bg-transparent rounded-lg hover:bg-action-hover ${
              scale === s ? "!bg-action" : ""
            }`}
            ariaLabel={`Scale ${s}x`}
          >
            {s}x
          </ActionButton>
        ))}
      </div>
      {(format === "jpeg" || format === "webp") && (
        <div className="mb-2">
          <label
            htmlFor="image-quality-slider"
            className="block text-xs text-muted mb-1"
          >
            {t("mapExport.download.imageOptions.quality")}
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
          <span className="ms-2 text-xs">
            {quality} <span className="text-muted"></span>
          </span>
        </div>
      )}
      {format === "jpeg" && (
        <div className="mb-2">
          <label className="block text-xs text-muted mb-1">
            {t("mapExport.download.imageOptions.background")}
          </label>
          <ColorSelectInput
            value={backgroundColor}
            onChange={setBackgroundColor}
          />
        </div>
      )}
    </div>
  );
}
