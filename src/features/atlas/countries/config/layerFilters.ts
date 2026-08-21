import type { Layer, LayerSelections } from "@features/atlas/layers/types";
import type { FilterConfig } from "@types";

interface LayerFilterProps {
  layerSelections: LayerSelections;
  setLayerSelections: React.Dispatch<React.SetStateAction<LayerSelections>>;
}

export const layerFiltersConfig: FilterConfig<Layer, LayerFilterProps, string> =
  {
    key: "layer",
    label: (layer: Layer) => `${layer.name} (${layer.countries.length})`,
    type: "select",
    getOptions: (layers?: Layer[]) => {
      const layer = layers?.[0];
      return [
        {
          value: "all",
          label: layer?.filterLabels?.all ?? "common:components.filter.all",
        },
        {
          value: "only",
          label:
            layer?.filterLabels?.only ?? "common:components.filter.includeOnly",
        },
        {
          value: "exclude",
          label:
            layer?.filterLabels?.exclude ?? "common:components.filter.exclude",
        },
      ];
    },
    getValue: (props, layer?: Layer) =>
      layer ? props.layerSelections[layer.id] || "all" : "all",
    setValue: (props, val, layer?: Layer) => {
      if (!layer) return;
      props.setLayerSelections((sel: LayerSelections) => ({
        ...sel,
        [layer.id]: val,
      }));
    },
  };
