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
            label={t("mapExport.visitedCountries")}
            aria-checked={includeVisitedCountries}
            aria-label={t("mapExport.visitedCountries")}
          />
        )}
        <Checkbox
          checked={includeLayers}
          onChange={() => setIncludeLayers(!includeLayers)}
          label={t("mapExport.visibleLayers")}
          aria-checked={includeLayers}
          aria-label={t("mapExport.visibleLayers")}
        />
        <Checkbox
          checked={includeMarkers}
          onChange={() => setIncludeMarkers(!includeMarkers)}
          label={t("mapExport.visibleMarkers")}
          aria-checked={includeMarkers}
          aria-label={t("mapExport.visibleMarkers")}
        />
      </div>
      <SectionHeader title={t("mapExport.mapDetails")} />
      <FormField label={t("mapExport.mapName")}>
        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder={t("mapExport.mapNamePlaceholder")}
          maxLength={64}
        />
      </FormField>
      <FormField label={t("mapExport.yourName")}>
        <input
          type="text"
          value={sharer}
          onChange={(e) => setSharer(e.target.value)}
          placeholder={t("mapExport.yourNamePlaceholder")}
          maxLength={32}
        />
      </FormField>
    </>
  );
}
