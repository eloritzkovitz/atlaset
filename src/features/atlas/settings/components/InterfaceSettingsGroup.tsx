import React from "react";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader } from "@components";
import { ICONS } from "@constants/icons";
import { useMapInterfaceSettings } from "../hooks/useMapInterfaceSettings";

export function InterfaceSettingsGroup() {
  const { t } = useTranslation("atlas");
  const { toolbarOrientation, setToolbarOrientation } =
    useMapInterfaceSettings();

  const [showInterfaceSettings, setShowInterfaceSettings] =
    React.useState(true);

  const orientations = [
    {
      key: "vertical" as const,
      label: t("mapSettings.interface.orientations.vertical"),
    },
    {
      key: "horizontal" as const,
      label: t("mapSettings.interface.orientations.horizontal"),
    },
  ];

  return (
    <>
      <CollapsibleHeader
        icon={<ICONS.mapSettings.interface />}
        label={t("mapSettings.interface.title")}
        expanded={showInterfaceSettings}
        onToggle={() => setShowInterfaceSettings((v) => !v)}
      />
      {showInterfaceSettings && (
        <div className="flex flex-col gap-2 font-semibold">
          <label>{t("mapSettings.interface.toolbarOrientation")}</label>

          <div className="grid grid-cols-2 gap-3">
            {orientations.map((item) => {
              const isActive = toolbarOrientation === item.key;
              const isVertical = item.key === "vertical";

              return (
                <div
                  key={item.key}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => setToolbarOrientation(item.key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setToolbarOrientation(item.key);
                    }
                  }}
                  className={`group flex flex-col items-center gap-2 rounded-xl p-2 transition-all duration-200 outline-none select-none cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/20"
                      : "hover:bg-surface-hover"
                  }`}
                >
                  <div className="relative h-16 w-full rounded-lg p-1.5 overflow-hidden">
                    {isVertical && (
                      <div className="absolute end-2 top-2 bottom-2 w-3 rounded-md bg-primary transition-transform group-hover:scale-105" />
                    )}
                    {!isVertical && (
                      <div className="absolute start-2 end-2 bottom-2 h-3 rounded-md bg-primary transition-transform group-hover:scale-105" />
                    )}
                  </div>

                  <span className="text-xs font-semibold transition-colors text-muted">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
