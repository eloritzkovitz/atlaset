import { FaLayerGroup } from "react-icons/fa6";
import { CollapsibleHeader, SelectInput } from "@components";
import { useOverlays } from "@contexts/OverlaysContext";
import { overlayFilterConfig } from "../../config/filtersConfig";

interface OverlayFiltersProps {
  expanded: boolean;
  onToggle: () => void;
}

export function OverlayFilters({ expanded, onToggle }: OverlayFiltersProps) {
  const { overlays, overlaySelections, setOverlaySelections } = useOverlays();
  return (
    <>
      <CollapsibleHeader
        icon={<FaLayerGroup />}
        label="Overlay Filters"
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded &&
        overlays.map((overlay) => (
          <SelectInput
            key={overlay.id}
            label={
              typeof overlayFilterConfig.label === "function"
                ? overlayFilterConfig.label(overlay)
                : overlayFilterConfig.label
            }
            value={overlayFilterConfig.getValue(
              { overlaySelections, setOverlaySelections },
              overlay
            )}
            onChange={(val) =>
              overlayFilterConfig.setValue(
                { overlaySelections, setOverlaySelections },
                String(val),
                overlay
              )
            }
            options={overlayFilterConfig.getOptions([overlay])}
          />
        ))}
    </>
  );
}
