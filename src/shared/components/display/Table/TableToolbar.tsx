import { useTranslation } from "react-i18next";
import { FaFileCsv } from "react-icons/fa6";
import { ICONS } from "@constants/icons";
import type { TableColumn } from "./Table";
import { exportTableToCSV } from "./utils";
import { ActionButton } from "../../inputs/Button/ActionButton";

interface TableToolbarProps<T> {
  columns: TableColumn<T>[];
  sortedItems: T[];
  hasActiveSort?: boolean;
  onResetSort?: () => void;
  onCopy: () => void;
  showExport?: boolean;
  exportFilename?: string;
}

export function TableToolbar<T>({
  columns,
  sortedItems,
  hasActiveSort,
  onResetSort,
  onCopy,
  showExport = false,
  exportFilename = "export.csv",
}: TableToolbarProps<T>) {
  const { t } = useTranslation("common");

  const hasData = sortedItems.length > 0;

  return (
    <div className="flex justify-end gap-2">
      {(hasActiveSort || onResetSort) && (
        <ActionButton
          variant="toggle"
          title={t("actions.resetSort", {
            defaultValue: "Reset sorting",
          })}
          ariaLabel={t("actions.resetSort", {
            defaultValue: "Reset sorting",
          })}
          icon={<ICONS.refresh />}
          onClick={onResetSort}
          rounded
        />
      )}
      {onCopy && (
        <ActionButton
          variant="toggle"
          title={t("actions.copyToClipboard", {
            defaultValue: "Copy to clipboard",
          })}
          ariaLabel={t("actions.copyToClipboard", {
            defaultValue: "Copy to clipboard",
          })}
          icon={<ICONS.duplicate />}
          onClick={onCopy}
          rounded
        />
      )}
      {showExport && hasData && (
        <ActionButton
          variant="toggle"
          title={t("components.table.exportCSV", {
            defaultValue: "Export CSV",
          })}
          ariaLabel={t("components.table.exportCSV", {
            defaultValue: "Export CSV",
          })}
          icon={<FaFileCsv />}
          onClick={() => exportTableToCSV(sortedItems, columns, exportFilename)}
          rounded
        />
      )}
    </div>
  );
}
