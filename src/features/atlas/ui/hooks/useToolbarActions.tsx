import { useTranslation } from "react-i18next";
import { DirectionalIcon } from "@components";
import { ICONS } from "@constants/icons";
import { keyCommands } from "@constants/keyCommands";
import type { CommandId } from "@types";
import { useAtlasActions } from "../../shared/hooks/useAtlasActions";

export interface ToolbarActionsParams {
  isMobile: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ToolbarActionItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  show: boolean;
  commandId: CommandId | null;
  separatorAfter?: boolean;
}

export function useToolbarActions({
  isMobile,
  setMenuOpen,
}: ToolbarActionsParams): ToolbarActionItem[] {
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

  const itemsMeta: Array<ToolbarActionItem> = [
    {
      key: "countries",
      icon: <ICONS.countries className="text-lg" />,
      label: t("toolbar.countries"),
      onClick: withMenuClose(actions.toggleCountries),
      show: conditions.countries,
      commandId: "atlas.countries",
    },
    {
      key: "layers",
      icon: <ICONS.layers className="text-lg" />,
      label: t("toolbar.layers"),
      onClick: withMenuClose(actions.toggleLayers),
      show: conditions.layers,
      commandId: "atlas.layers",
    },
    {
      key: "markers",
      icon: <ICONS.markers className="text-lg" />,
      label: t("toolbar.markers"),
      onClick: withMenuClose(actions.toggleMarkers),
      show: conditions.markers,
      commandId: "atlas.markers",
    },
    {
      key: "colorModes",
      icon: <ICONS.colorModes className="text-lg" />,
      label: t("toolbar.colorModes"),
      onClick: withMenuClose(actions.toggleColorMode),
      show: conditions.colorModes,
      commandId: "atlas.colorModes",
      separatorAfter: isAtlasActive,
    },
    {
      key: "legend",
      icon: <ICONS.legend className="text-lg" />,
      label: t("toolbar.legend"),
      onClick: withMenuClose(actions.toggleLegend),
      show: conditions.legend,
      commandId: "atlas.legend",
      separatorAfter: true,
    },
    {
      key: "savedmaps",
      icon: <ICONS.saved className="text-lg" />,
      label: t("toolbar.myMaps"),
      onClick: withMenuClose(actions.toggleSavedMaps),
      show: conditions.savedmaps,
      commandId: "atlas.savedMaps",
      separatorAfter: isEdit,
    },
    {
      key: "timeline",
      icon: <ICONS.timeline className="text-xl" />,
      label: t("toolbar.timeline"),
      onClick: withMenuClose(actions.toggleTimelineMode),
      show: conditions.timeline,
      commandId: "atlas.timeline",
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
      commandId: "atlas.export",
    },
    {
      key: "settings",
      icon: <ICONS.settings className="text-lg" />,
      label: t("toolbar.mapSettings"),
      onClick: withMenuClose(actions.toggleSettings),
      show: conditions.settings,
      commandId: "atlas.settings",
    },
    {
      key: "exit",
      icon: <DirectionalIcon variant="arrow" className="text-lg" />,
      label: isEdit ? t("toolbar.exitEditMode") : t("toolbar.exitSharedView"),
      onClick: withMenuClose(actions.handleExit),
      show: conditions.exit,
      commandId: null,
    },
  ];

  return itemsMeta.map((item) => {
    // Only search for a shortcut if commandId is explicitly provided
    const matchedShortcut = item.commandId
      ? keyCommands.find((cmd) => cmd.id === item.commandId)
      : null;

    // Only attach the shortcut property if a valid match was actually found
    const shortcutProps = matchedShortcut ? { shortcut: matchedShortcut } : {};

    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      onClick: item.onClick,
      show: item.show,
      separatorAfter: item.separatorAfter,
      commandId: item.commandId,
      ...shortcutProps,
    };
  });
}
