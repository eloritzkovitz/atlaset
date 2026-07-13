import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@components";

export function SvgOptions({
  onOptionsChange,
}: {
  onOptionsChange: (opts: { svgInlineStyles: boolean }) => void;
}) {
  const { t } = useTranslation("atlas");

  const [svgInlineStyles, setSvgInlineStyles] = useState(true);
  const [includeTitles, setIncludeTitles] = useState(true);

  // Notify parent of option changes
  useEffect(() => {
    onOptionsChange({ svgInlineStyles });
  }, [svgInlineStyles, onOptionsChange]);

  return (
    <div className="flex flex-col items-start gap-2 mb-4">
      <Checkbox
        checked={svgInlineStyles}
        onChange={setSvgInlineStyles}
        label={t("mapExport.download.svgOptions.inlineStyles")}
      />
      <Checkbox
        checked={includeTitles}
        onChange={setIncludeTitles}
        label={t("mapExport.download.svgOptions.includeTitles")}
      />
    </div>
  );
}
