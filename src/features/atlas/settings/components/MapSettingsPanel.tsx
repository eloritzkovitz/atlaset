import { useTranslation } from "react-i18next";
import { Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useUI } from "@contexts/UIContext";
import { ColorsSettingsGroup } from "./ColorsSettingsGroup";
import { ConfigurationSettingsGroup } from "./ConfigurationSettingsGroup";

export function MapSettingsPanel() {
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
    >
      <div className="mt-4">
        <ConfigurationSettingsGroup />
        <Separator className="my-4" />
        <ColorsSettingsGroup />
      </div>
    </Panel>
  );
}
