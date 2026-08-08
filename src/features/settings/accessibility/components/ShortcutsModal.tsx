import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalHeader, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { categoryColumns, keyCommands } from "@constants/keyCommands";
import { useUI } from "@app/contexts/UIContext";
import type { KeyCommand } from "@types";
import { canonicalKey, isRestrictedSingleKey } from "@utils";
import { ShortcutRow } from "./ShortcutRow";
import { ShortcutsToggle } from "./ShortcutsToggle";
import { useAccessibility } from "../hooks/useAccessibility";

/** Renders a modal for displaying keyboard shortcuts. */
export function ShortcutsModal() {
  const { singleKeyShortcutsEnabled } = useAccessibility();
  const { showShortcuts, closeShortcuts } = useUI();
  const { t } = useTranslation("common");

  // Group shortcuts by category
  const groupedCommands = useMemo(() => {
    return keyCommands.reduce(
      (acc, cmd) => {
        acc[cmd.category] = acc[cmd.category] || [];
        acc[cmd.category].push(cmd);
        return acc;
      },
      {} as Record<string, KeyCommand[]>,
    );
  }, []);

  return (
    <Modal
      isOpen={showShortcuts}
      onClose={closeShortcuts}
      position="center"
      className="min-w-[1000px] max-w-[1200px] max-h-[90vh] flex flex-col"
    >
      <ModalHeader
        title={
          <>
            <ICONS.shortcuts /> {t("shortcuts.title", "Keyboard Shortcuts")}
          </>
        }
      />

      {/* Main Grid content area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full overflow-y-auto p-4 flex-1">
        {categoryColumns.map((categories, colIdx) => (
          <div key={colIdx} className="w-full">
            {categories.map((category) =>
              groupedCommands[category] ? (
                <div key={category} className="mb-6">
                  <div className="text-lg font-bold mb-2 text-start">
                    {t(
                      `shortcuts.categories.${canonicalKey(category)}`,
                      category,
                    )}
                  </div>
                  <table className="w-full mx-auto text-start">
                    <tbody>
                      {groupedCommands[category].map((cmd) => {
                        const isCharacterShortcut = isRestrictedSingleKey(cmd);
                        const isRowDisabled =
                          isCharacterShortcut && !singleKeyShortcutsEnabled;

                        return (
                          <ShortcutRow
                            key={cmd.key + cmd.modifiers.join("+")}
                            cmd={cmd}
                            disabled={isRowDisabled}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null,
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Footer with toggle for single-key shortcuts */}
      <div className="pt-4 px-4 w-full">
        <ShortcutsToggle />
      </div>
    </Modal>
  );
}
