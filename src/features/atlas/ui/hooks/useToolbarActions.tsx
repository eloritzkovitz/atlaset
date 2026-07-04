import { useTranslation } from "react-i18next";
import { DirectionalIcon } from "@components";
import { ICONS } from "@constants/icons";
import { useAtlasActions } from "../../shared/hooks/useAtlasActions";

export interface ToolbarActionsParams {
  isMobile: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useToolbarActions({
  isMobile,
  setMenuOpen,
}: ToolbarActionsParams) {
  const { t } = useTranslation("atlas");
  const { actions, conditions, isAtlasActive, isReadonly, isEdit } =
    useAtlasActions();

  // Closes the menu (on mobile) and then executes the action
  function withMenuClose(action: () => void) {
    return () => {
      if (isMobile) setMenuOpen(false);
      action();
    };
  }

  return [
    {
      key: "countries",
      icon: <ICONS.countries className="text-lg" />,
      label: t("toolbar.countries"),
      onClick: withMenuClose(actions.toggleCountries),
      show: conditions.countries,
    },
    {
      key: "layers",
      icon: <ICONS.layers className="text-lg" />,
      label: t("toolbar.layers"),
      onClick: withMenuClose(actions.toggleLayers),
      show: conditions.layers,
    },
    {
      key: "markers",
      icon: <ICONS.markers className="text-lg" />,
      label: t("toolbar.markers"),
      onClick: withMenuClose(actions.toggleMarkers),
      show: conditions.markers,
    },
    {
      key: "colorModes",
      icon: <ICONS.colorModes className="text-lg" />,
      label: t("toolbar.colorModes"),
      onClick: withMenuClose(actions.toggleColorMode),
      show: conditions.colorModes,
      separatorAfter: isAtlasActive,
    },
    {
      key: "legend",
      icon: <ICONS.legend className="text-lg" />,
      label: t("toolbar.legend"),
      onClick: withMenuClose(actions.toggleLegend),
      show: conditions.legend,
      separatorAfter: true,
    },
    {
      key: "savedmaps",
      icon: <ICONS.saved className="text-lg" />,
      label: t("toolbar.myMaps"),
      onClick: withMenuClose(actions.toggleSavedMaps),
      show: conditions.savedmaps,
      separatorAfter: isEdit,
    },
    {
      key: "timeline",
      icon: <ICONS.timeline className="text-xl" />,
      label: t("toolbar.timeline"),
      onClick: withMenuClose(actions.toggleTimelineMode),
      show: conditions.timeline,
      separatorAfter: true,
    },
    {
      key: "export",
      icon: !isReadonly ? (
        <ICONS.export className="text-lg" />
      ) : (
        <ICONS.download className="text-lg" />
      ),
      label: !isReadonly ? t("toolbar.export") : t("toolbar.download"),
      onClick: withMenuClose(actions.toggleExport),
      show: conditions.export,
    },
    {
      key: "settings",
      icon: <ICONS.settings className="text-lg" />,
      label: t("toolbar.mapSettings"),
      onClick: withMenuClose(actions.toggleSettings),
      show: conditions.settings,
    },
    {
      key: "exit",
      icon: <DirectionalIcon variant="arrow" className="text-lg" />,
      label: isEdit ? t("toolbar.exitEditMode") : t("toolbar.exitSharedView"),
      onClick: withMenuClose(actions.handleExit),
      show: conditions.exit,
    },
  ];
}
