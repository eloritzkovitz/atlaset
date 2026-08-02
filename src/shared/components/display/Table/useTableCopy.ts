import { useState, useCallback } from "react";
import { copyToClipboard } from "@utils/clipboard";
import type { TableColumn } from "./Table";
import { formatTableToTSV } from "./utils";

/**
 * Copies the table data to the clipboard in TSV format.
 * @param data - The data to be copied.
 * @param columns - The columns of the table, used to format the data.
 * @returns An object containing the copyTable function and a copied state.
 */
export function useTableCopy<T>(data: T[], columns: TableColumn<T>[]) {
  const [copied, setCopied] = useState(false);

  const copyTable = useCallback(async () => {
    const textPayload = formatTableToTSV(data, columns);
    const success = await copyToClipboard(textPayload);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    return success;
  }, [data, columns]);

  return { copyTable, copied };
}
