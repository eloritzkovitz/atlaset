import { useState, useEffect } from "react";
import { Checkbox } from "@components";

export function SvgOptions({
  onOptionsChange,
}: {
  onOptionsChange: (opts: { svgInlineStyles: boolean }) => void;
}) {
  const [svgInlineStyles, setSvgInlineStyles] = useState(true);

  // Notify parent of option changes
  useEffect(() => {
    onOptionsChange({ svgInlineStyles });
  }, [svgInlineStyles, onOptionsChange]);

  return (
    <div className="flex items-center gap-2 mb-4 text-sm">
      <Checkbox checked={svgInlineStyles} onChange={setSvgInlineStyles} />
      <span className="whitespace-nowrap">
        Inline styles
      </span>
    </div>
  );
}
