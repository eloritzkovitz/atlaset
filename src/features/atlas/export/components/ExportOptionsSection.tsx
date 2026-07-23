import { useTranslation } from "react-i18next";
import { Checkbox, FormField, SectionHeader } from "@components";
import { useMapView } from "@contexts/MapViewContext";

interface ExportOptionsSectionProps {
  includeVisitedCountries: boolean;
  setIncludeVisitedCountries: (v: boolean) => void;
  includeLayers: boolean;
  setIncludeLayers: (v: boolean) => void;
  includeMarkers: boolean;
  setIncludeMarkers: (v: boolean) => void;
  mapName: string;
  setMapName: (v: string) => void;
  sharer: string;
  setSharer: (v: string) => void;
}

export function ExportOptionsSection({
  includeVisitedCountries,
  setIncludeVisitedCountries,
  includeLayers,
  setIncludeLayers,
  includeMarkers,
  setIncludeMarkers,
  mapName,
  setMapName,
  sharer,
  setSharer,
}: ExportOptionsSectionProps) {
  const { isEdit } = useMapView();
  const { t } = useTranslation("atlas");

  return (
    <>
      <SectionHeader title={t("mapExport.options")} />
      <div className="flex flex-col gap-2 mb-4">
        {!isEdit && (
          <Checkbox
            checked={includeVisitedCountries}
            onChange={() =>
              setIncludeVisitedCountries(!includeVisitedCountries)
            }
            label={t("mapExport.exportOptions.visitedCountries")}
            aria-checked={includeVisitedCountries}
            aria-label={t("mapExport.exportOptions.visitedCountries")}
          />
        )}
        <Checkbox
          checked={includeLayers}
          onChange={() => setIncludeLayers(!includeLayers)}
          label={t("mapExport.exportOptions.visibleLayers")}
          aria-checked={includeLayers}
          aria-label={t("mapExport.exportOptions.visibleLayers")}
        />
        <Checkbox
          checked={includeMarkers}
          onChange={() => setIncludeMarkers(!includeMarkers)}
          label={t("mapExport.exportOptions.visibleMarkers")}
          aria-checked={includeMarkers}
          aria-label={t("mapExport.exportOptions.visibleMarkers")}
        />
      </div>

      <SectionHeader title={t("mapExport.mapDetails.title")} />
      <FormField
        id="map-name"
        name="map-name"
        label={t("mapExport.mapDetails.mapName")}
      >
        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder={t("mapExport.mapDetails.mapNamePlaceholder")}
          maxLength={64}
        />
      </FormField>
      <FormField
        id="sharer-name"
        name="sharer-name"
        label={t("mapExport.mapDetails.yourName")}
      >
        <input
          type="text"
          value={sharer}
          onChange={(e) => setSharer(e.target.value)}
          placeholder={t("mapExport.mapDetails.yourNamePlaceholder")}
          maxLength={32}
        />
      </FormField>
    </>
  );
}
