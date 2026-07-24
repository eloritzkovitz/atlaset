import { useTranslation } from "react-i18next";
import { CollapsibleHeader, SelectInput } from "@components";
import { ICONS } from "@constants/icons";
import { useLayers } from "@contexts/LayersContext";
import type { AnyLayer } from "@features/atlas/layers/types";
import { layerFilterConfig } from "../../config/filtersConfig";

interface LayerFiltersProps {
  layers: AnyLayer[];
  expanded: boolean;
  onToggle: () => void;
}

export function LayerFilters({
  layers,
  expanded,
  onToggle,
}: LayerFiltersProps) {
  const { layerSelections, setLayerSelections } = useLayers();
  const { t } = useTranslation("atlas");

  return (
    <>
      <CollapsibleHeader
        icon={<ICONS.layers />}
        label={t("countries.filters.layer.title")}
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded &&
        layers.map((layer) => (
          <SelectInput
            key={layer.id}
            label={
              typeof layerFilterConfig.label === "function"
                ? t(layerFilterConfig.label(layer))
                : t(layerFilterConfig.label)
            }
            value={layerFilterConfig.getValue(
              { layerSelections, setLayerSelections },
              layer,
            )}
            onChange={(val) =>
              layerFilterConfig.setValue(
                { layerSelections, setLayerSelections },
                String(val),
                layer,
              )
            }
            options={layerFilterConfig.getOptions([layer])}
          />
        ))}
    </>
  );
}
