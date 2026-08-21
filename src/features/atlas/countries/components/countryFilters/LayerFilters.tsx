import { useTranslation } from "react-i18next";
import { CollapsibleHeader, SelectInput } from "@components";
import { ICONS } from "@constants/icons";
import { useLayers } from "@features/atlas/layers";
import type { AnyLayer } from "@features/atlas/layers/types";
import { layerFiltersConfig } from "../../config/layerFilters";

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
              typeof layerFiltersConfig.label === "function"
                ? t(layerFiltersConfig.label(layer))
                : t(layerFiltersConfig.label)
            }
            value={layerFiltersConfig.getValue(
              { layerSelections, setLayerSelections },
              layer,
            )}
            onChange={(val) =>
              layerFiltersConfig.setValue(
                { layerSelections, setLayerSelections },
                String(val),
                layer,
              )
            }
            options={layerFiltersConfig.getOptions([layer])}
          />
        ))}
    </>
  );
}
