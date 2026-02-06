import { FaGear, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, Separator } from "@components";
import { DEFAULT_PANEL_WIDTH } from "@constants";
import { useUI } from "@contexts/UIContext";
import { ColorsSettingsGroup } from "./ColorsSettingsGroup";
import { ConfigurationSettingsGroup } from "./ConfigurationSettingsGroup";

export function MapSettingsPanel() {
  const { showSettings, closePanel } = useUI();

  return (
    <Panel
      title={
        <>
          <FaGear />
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
          icon={<FaXmark className="text-2xl" />}
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
