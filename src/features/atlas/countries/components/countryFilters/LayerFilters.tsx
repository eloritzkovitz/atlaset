import { CollapsibleHeader, SelectInput } from "@components";
import { ICONS } from "@constants/icons";
import { useLayers } from "@contexts/LayersContext";
import { useEffectiveLayers } from "@features/atlas/layers/hooks/useEffectiveLayers";
import { layerFilterConfig } from "../../config/filtersConfig";

interface LayerFiltersProps {
  expanded: boolean;
  onToggle: () => void;
}

export function LayerFilters({ expanded, onToggle }: LayerFiltersProps) {
  const { layerSelections, setLayerSelections } = useLayers();
  const effectiveLayers = useEffectiveLayers();

  return (
    <>
      <CollapsibleHeader
        icon={<ICONS.layers />}
        label="Layer Filters"
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded &&
        effectiveLayers.map((layer) => (
          <SelectInput
            key={layer.id}
            label={
              typeof layerFilterConfig.label === "function"
                ? layerFilterConfig.label(layer)
                : layerFilterConfig.label
            }
            value={layerFilterConfig.getValue(
              { layerSelections, setLayerSelections },
              layer
            )}
            onChange={(val) =>
              layerFilterConfig.setValue(
                { layerSelections, setLayerSelections },
                String(val),
                layer
              )
            }
            options={layerFilterConfig.getOptions([layer])}
          />
        ))}
    </>
  );
}
