import { Checkbox, FormField } from "@components";

interface ExportOptionsSectionProps {
  exportMode: "visited" | "layers";
  setExportMode: (mode: "visited" | "layers") => void;
  includeMarkers: boolean;
  setIncludeMarkers: (v: boolean) => void;
  mapName: string;
  setMapName: (v: string) => void;
  sharer: string;
  setSharer: (v: string) => void;
}

export function ExportOptionsSection({
  exportMode,
  setExportMode,
  includeMarkers,
  setIncludeMarkers,
  mapName,
  setMapName,
  sharer,
  setSharer,
}: ExportOptionsSectionProps) {
  return (
    <>
      <div className="mb-4 text-muted text-xs font-semibold uppercase tracking-wide">
        Options
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <Checkbox
          checked={exportMode === "visited"}
          onChange={() => setExportMode("visited")}
          label="Visited countries only"
          aria-checked={exportMode === "visited"}
          aria-label="Visited countries only"
        />
        <Checkbox
          checked={exportMode === "layers"}
          onChange={() => setExportMode("layers")}
          label="All visible layers"
          aria-checked={exportMode === "layers"}
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
      <div className="mt-4 mb-4 text-muted text-xs font-semibold uppercase tracking-wide">
        Map Details (Optional)
      </div>
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
