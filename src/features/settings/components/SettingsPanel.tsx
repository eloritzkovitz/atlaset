import { FaGear, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, Separator } from "@components";
import { DEFAULT_PANEL_WIDTH } from "@constants";
import { useUI } from "@contexts/UIContext";
import { OverlayPaletteSettingsGroup } from "./colors/OverlayPaletteSettingsGroup";
import { HomeCountrySelect } from "./home/HomeCountrySelect";
import { MapSettingsGroup } from "./map/MapSettingsGroup";
import { ThemeSettingsGroup } from "./theme/ThemeSettingsGroup";
import "./Settings.css";

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
          className="action-btn action-btn-close"
        >
          <FaXmark />
        </ActionButton>
      }
    >
      <HomeCountrySelect />
      <Separator className="my-4" />
      <ThemeSettingsGroup />
      <Separator className="my-4" />
      <MapSettingsGroup />
      <Separator className="my-4" />
      <OverlayPaletteSettingsGroup />
    </Panel>
  );
}
