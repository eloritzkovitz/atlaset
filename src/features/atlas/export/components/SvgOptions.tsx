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
      <span className="text-gray-700 dark:text-gray-200 whitespace-nowrap">
        Inline styles
      </span>
    </div>
  );
}
