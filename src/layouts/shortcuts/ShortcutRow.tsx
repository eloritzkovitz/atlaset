import { useTranslation } from "react-i18next";
import { KeyCombo } from "@components";
import type { KeyCommand } from "@types";
import { slugify } from "@utils/string";

export function ShortcutRow({ cmd }: { cmd: KeyCommand }) {
  const { t } = useTranslation("common");
  const keys = [...cmd.modifiers, cmd.key];
  const actionKey = slugify(cmd.action || "").replace(/-/g, "_");
  const actionLabel = t(`shortcuts.actions.${actionKey}`, cmd.action);

  return (
    <tr key={cmd.key + cmd.modifiers.join("+")}>
      <td className="py-2 pe-6 min-w-[90px]">
        <KeyCombo keys={keys} />
      </td>
      <td className="py-1 text-sm select-none text-start">{actionLabel}</td>
    </tr>
  );
}
