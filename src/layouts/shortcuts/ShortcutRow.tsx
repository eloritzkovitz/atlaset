import { KeyCombo } from "@components";
import type { KeyCommand } from "@types";

export function ShortcutRow({ cmd }: { cmd: KeyCommand }) {
  const keys = [...cmd.modifiers, cmd.key];
  return (
    <tr key={cmd.key + cmd.modifiers.join("+")}>
      <td className="py-2 pe-6 min-w-[90px]">
        <KeyCombo keys={keys} />
      </td>
      <td className="py-1 text-sm select-none text-start">{cmd.action}</td>
    </tr>
  );
}
