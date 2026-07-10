import { useTranslation } from "react-i18next";
import { KeyCombo } from "@components";
import type { KeyCommand } from "@types";

interface ShortcutRowProps {
  cmd: KeyCommand;
  disabled?: boolean;
}

export function ShortcutRow({ cmd, disabled = false }: ShortcutRowProps) {
  const { t } = useTranslation("common");
  const keys = [...cmd.modifiers, cmd.key];
  const actionLabel = t(cmd.labelKey, "Unknown Action");

  return (
    <tr
      className={`transition-opacity duration-200 ${disabled ? "opacity-40 select-none pointer-events-none" : ""}`}
      key={cmd.key + cmd.modifiers.join("+")}
    >
      <td className="py-2 pe-6 min-w-[90px]">
        <KeyCombo keys={keys} />
      </td>
      <td className="py-1 text-sm text-start">{actionLabel}</td>
    </tr>
  );
}
