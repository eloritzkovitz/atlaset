import { FaGear, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, Separator } from "@components";
import { DEFAULT_PANEL_WIDTH } from "@constants";
import { useUI } from "@contexts/UIContext";
import { MapSettingsGroup } from "./map/MapSettingsGroup";
import { OverlaySettingsGroup } from "./overlays/OverlaySettingsGroup";

export function SettingsPanel() {
  const { showSettings, closePanel } = useUI();

  return (
    <Panel
      title={
        <>
          <FaGear />
          Settings
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
      <MapSettingsGroup />
      <Separator className="my-4" />
      <OverlaySettingsGroup />
    </Panel>
  );
}
