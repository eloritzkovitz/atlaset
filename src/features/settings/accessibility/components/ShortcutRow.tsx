import { useTranslation } from "react-i18next";
import { KeyCombo } from "@components";
import type { KeyCommand } from "@types";
import { useLanguage } from "../../account/hooks/useLanguage";

interface ShortcutRowProps {
  cmd: KeyCommand;
  disabled?: boolean;
}

export function ShortcutRow({ cmd, disabled = false }: ShortcutRowProps) {
  const { isRtl } = useLanguage();
  const { t } = useTranslation("common");

  const keys = [...cmd.modifiers, cmd.key];
  const actionLabel = t(cmd.labelKey, "Unknown Action");

  return (
    <tr
      className={`transition-opacity duration-200 ${
        disabled ? "opacity-40 select-none pointer-events-none" : ""
      }`}
    >
      <td className="py-2 w-full">
        <div className="flex items-center justify-between gap-6 w-full">
          <span className="text-sm text-start font-medium order-1">
            {actionLabel}
          </span>
          <div className="flex-shrink-0 order-2">
            <KeyCombo keys={keys} isRtl={isRtl} />
          </div>
        </div>
      </td>
    </tr>
  );
}
