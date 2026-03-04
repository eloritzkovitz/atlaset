import { ActionButton, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useUI } from "@contexts/UIContext";
import { ColorsSettingsGroup } from "./ColorsSettingsGroup";
import { ConfigurationSettingsGroup } from "./ConfigurationSettingsGroup";

export function MapSettingsPanel() {
  const { showSettings, closePanel } = useUI();

  return (
    <Panel
      title={
        <>
          <ICONS.settings />
          Map Settings
        </>
      }
      show={showSettings}
      width={DEFAULT_PANEL_WIDTH}
      onHide={closePanel}
      headerActions={
        <ActionButton
          onClick={closePanel}
          ariaLabel="Close settings panel"
          title="Close"
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      }
    >
      <div className="mt-4">
        <ConfigurationSettingsGroup />
        <Separator className="my-4" />
        <ColorsSettingsGroup />
      </div>
    </Panel>
  );
}
