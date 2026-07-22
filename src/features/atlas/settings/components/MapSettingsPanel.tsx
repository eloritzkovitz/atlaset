import { useTranslation } from "react-i18next";
import { Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useUI } from "@contexts/UIContext";
import { useAccessibility } from "@features/settings";
import { ColorsSettingsGroup } from "./ColorsSettingsGroup";
import { ConfigurationSettingsGroup } from "./ConfigurationSettingsGroup";
import { InterfaceSettingsGroup } from "./InterfaceSettingsGroup";
import { OverlaySettingsGroup } from "./OverlaySettingsGroup";

export function MapSettingsPanel() {
  const { animationsEnabled } = useAccessibility();
  const { showSettings, closePanel } = useUI();
  const { t } = useTranslation("atlas");

  return (
    <Panel
      title={
        <>
          <ICONS.settings />
          {t("mapSettings.title")}
        </>
      }
      show={showSettings}
      width={DEFAULT_PANEL_WIDTH}
      onHide={closePanel}
      animationsEnabled={animationsEnabled}
    >
      <div className="mt-4">
        <ConfigurationSettingsGroup />
        <Separator className="my-4" />
        <InterfaceSettingsGroup />
        <Separator className="my-4" />
        <OverlaySettingsGroup />
        <Separator className="my-4" />
        <ColorsSettingsGroup />
      </div>
    </Panel>
  );
}
