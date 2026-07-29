import { useTranslation } from "react-i18next";
import {
  ActionButton,
  CollapsibleHeader,
  SectionHeader,
  SelectInput,
} from "@components";
import { ICONS } from "@constants/icons";
import { useLayers } from "@features/atlas/layers";
import { useMarkers } from "@features/atlas/markers";
import { SvgOptions } from "./options/SvgOptions";
import { ImageOptions } from "./options/ImageOptions";
import {
  EXPORT_FORMAT_OPTIONS,
  PNG_SCALE_OPTIONS,
} from "../constants/exportOptions";
import type {
  ExportFormat,
  ImageExportOptions,
  SvgExportOptions,
} from "../types";
import { isImageFormat } from "../utils/format";
import { exportMap } from "../utils/mapExport";

interface DownloadMapSectionProps {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
  format: ExportFormat;
  setFormat: (f: ExportFormat) => void;
  svgOptions: React.RefObject<SvgExportOptions>;
  imageOptions: React.RefObject<ImageExportOptions>;
}

export function DownloadMapSection({
  expanded,
  setExpanded,
  svgRef,
  format,
  setFormat,
  svgOptions,
  imageOptions,
}: DownloadMapSectionProps) {
  const { layers } = useLayers();
  const { markers } = useMarkers();
  const { t } = useTranslation("atlas");

  // Handle downloading the map as SVG, image or JSON
  const handleExport = () => {
    exportMap({
      svgRef,
      format,
      svgOptions,
      imageOptions,
      jsonData: { layers, markers },
    });
  };

  const hasOptions = format === "svg" || isImageFormat(format);
  const isButtonDisabled = format !== "json" && !svgRef?.current;

  return (
    <CollapsibleHeader
      icon={<ICONS.download />}
      label={t("mapExport.download.title")}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {/* Format selector */}
      <SectionHeader
        title={t("mapExport.download.format")}
        className="!-mb-2"
      />
      <SelectInput
        label=""
        value={format}
        onChange={(val) => setFormat(val as ExportFormat)}
        options={EXPORT_FORMAT_OPTIONS}
      />

      {/* Options section */}
      <SectionHeader
        title={
          hasOptions
            ? t("mapExport.options")
            : t("mapExport.download.jsonDescription")
        }
      />

      {format === "svg" && (
        <SvgOptions
          onOptionsChange={(opts) => {
            svgOptions.current = opts;
          }}
        />
      )}

      {isImageFormat(format) && (
        <ImageOptions
          format={format}
          scaleOptions={PNG_SCALE_OPTIONS}
          onOptionsChange={(opts) => {
            imageOptions.current = opts;
          }}
        />
      )}

      <div className="mt-4">
        <ActionButton
          variant="primary"
          onClick={handleExport}
          className="w-full"
          aria-label={t("mapExport.download.title")}
          disabled={isButtonDisabled}
        >
          <ICONS.download className="inline" />
          {t("mapExport.download.title")}
        </ActionButton>
      </div>
    </CollapsibleHeader>
  );
}
