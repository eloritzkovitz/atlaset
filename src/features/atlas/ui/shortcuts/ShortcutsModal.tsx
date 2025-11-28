import { useMemo } from "react";
import { FaKeyboard, FaXmark } from "react-icons/fa6";
import { ActionButton, Modal, PanelHeader } from "@components";
import { categoryColumns, keyCommands } from "@constants/keyCommands";
import { useUI } from "@contexts/UIContext";
import type { KeyCommand } from "@types";
import { ShortcutRow } from "./ShortcutRow";

export function ShortcutsModal() {
  const { openModal, closeModal } = useUI();

  // Group shortcuts by category
  const groupedCommands = useMemo(() => {
    return keyCommands.reduce((acc, cmd) => {
      acc[cmd.category] = acc[cmd.category] || [];
      acc[cmd.category].push(cmd);
      return acc;
    }, {} as Record<string, KeyCommand[]>);
  }, [keyCommands]);

  return (
    <Modal
      isOpen={openModal === "shortcuts"}
      onClose={closeModal}
      position="center"
      className="min-w-[900px] max-w-[1200px] max-h-[90vh] bg-white rounded-xl shadow-2xl p-4 overflow-y-auto"
    >
      <PanelHeader
        title={
          <>
            <FaKeyboard />
            Keyboard Shortcuts
          </>
        }
        showSeparator={true}
      >
        <ActionButton onClick={closeModal} ariaLabel="Close" title="Close">
          <FaXmark />
        </ActionButton>
      </PanelHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {categoryColumns.map((categories, colIdx) => (
          <div key={colIdx} className="w-full">
            {categories.map((category) =>
              groupedCommands[category] ? (
                <div key={category} className="mb-6">
                  <div className="text-lg font-bold mb-2 text-left">
                    {category}
                  </div>
                  <table className="w-full mx-auto text-left">
                    <tbody>
                      {/* Render each command in the category */}
                      {groupedCommands[category].map((cmd) => (
                        <ShortcutRow
                          key={cmd.key + cmd.modifiers.join("+")}
                          cmd={cmd}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
