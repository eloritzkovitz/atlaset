import type { KeyCommand } from "@types";
import { KeyCombo } from "./KeyCombo";

export function ShortcutRow({ cmd }: { cmd: KeyCommand }) {
  const keys = [...cmd.modifiers, cmd.key];
  return (
    <tr key={cmd.key + cmd.modifiers.join("+")}>
      <td className="py-2 pr-6 min-w-[90px]">
        <KeyCombo keys={keys} />
      </td>
      <td className="py-1 text-sm select-none">{cmd.action}</td>
    </tr>
  );
}
