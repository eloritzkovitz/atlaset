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

  return (
    <>
      <SectionHeader title="Options" />
      <div className="flex flex-col gap-2 mb-4">
        {!isEdit && (
          <Checkbox
            checked={includeVisitedCountries}
            onChange={() =>
              setIncludeVisitedCountries(!includeVisitedCountries)
            }
            label="Visited countries"
            aria-checked={includeVisitedCountries}
            aria-label="Visited countries"
          />
        )}
        <Checkbox
          checked={includeLayers}
          onChange={() => setIncludeLayers(!includeLayers)}
          label="All visible layers"
          aria-checked={includeLayers}
          aria-label="All visible layers"
        />
        <Checkbox
          checked={includeMarkers}
          onChange={() => setIncludeMarkers(!includeMarkers)}
          label="All visible markers"
          aria-checked={includeMarkers}
          aria-label="All visible markers"
        />
      </div>
      <SectionHeader title="Map Details (Optional)" />
      <FormField label="Map Name">
        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder="My Shared Map"
          maxLength={64}
        />
      </FormField>
      <FormField label="Your Name">
        <input
          type="text"
          value={sharer}
          onChange={(e) => setSharer(e.target.value)}
          placeholder="Your Name"
          maxLength={32}
        />
      </FormField>
    </>
  );
}
