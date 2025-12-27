import { ColorDot } from "@components";
import type { LegendItem } from "../../types";

export function LegendRow({ color, label, icon }: LegendItem) {
  return (
    <div className="flex items-center gap-4">
      {icon ? (
        <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      ) : (
        <>
          <ColorDot color={color} size={24} />
          <label>{label}</label>
        </>
      )}
    </div>
  );
}
