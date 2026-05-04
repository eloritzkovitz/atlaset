import { useMemo } from "react";
import { FaEllipsis } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { PAGE_SIZE_OPTIONS } from "@constants/ui";
import { getPageButtons } from "@utils/pagination";
import { pluralize } from "@utils/string";
import { PaginationButton } from "./PaginationButton";
import { ActionButton } from "../../action/ActionButton";
import { SelectInput } from "../../form/inputs/SelectInput";
import { DirectionalIcon } from "../../ui/DirectionalIcon";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCount: number;
  onPageSizeChange?: (size: number) => void;
  itemLabel?: string | { singular: string; plural: string };
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCount,
  onPageSizeChange,
  itemLabel = "item",
}: PaginationProps) {
  const { t } = useTranslation("common");
  const pages = useMemo(
    () => getPageButtons(currentPage, totalPages),
    [currentPage, totalPages],
  );

  // Calculate the number of items shown on this page
  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);
  const showingCount = endIdx - startIdx + 1;

  const renderedItemLabel =
    typeof itemLabel === "string"
      ? pluralize(itemLabel, totalCount)
      : totalCount === 1
        ? itemLabel.singular
        : itemLabel.plural;

  return (
    <div className="relative flex items-center my-4 w-full min-h-[40px]">
      {/* Left: Showing X */}
      <div className="absolute start-0 flex items-center gap-4 ps-4 h-full">
        <span className="text-muted whitespace-nowrap flex items-center gap-1">
          {t("pagination.showing")}
          {onPageSizeChange ? (
            <>
              <div className="w-[65px] mx-2">
                <SelectInput
                  value={pageSize}
                  onChange={(val) => onPageSizeChange(Number(val))}
                  options={PAGE_SIZE_OPTIONS.map((opt) => ({
                    value: opt,
                    label: opt.toString(),
                  }))}
                  placeholder={t("pagination.pageSize")}
                  aria-label={t("pagination.selectPageSize")}
                />
              </div>
              {t("pagination.of")} {totalCount} {renderedItemLabel}
            </>
          ) : (
            <>
              {showingCount} {t("pagination.of")} {totalCount}{" "}
              {renderedItemLabel}
            </>
          )}
        </span>
      </div>
      {/* Center: Page controls */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <ActionButton
            variant="secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            ariaLabel={t("pagination.prevAria")}
            className="min-h-[2.5rem] text-base"
          >
            <span
              className={`inline-flex items-center gap-1${
                currentPage === 1 ? " text-muted" : ""
              }`}
              style={{ lineHeight: 1 }}
            >
              <DirectionalIcon
                variant="chevron"
                direction="prev"
                className="text-xs align-middle mt-0.5 me-1"
              />
              <span className="align-middle">{t("pagination.back")}</span>
            </span>
          </ActionButton>
          {pages.map((page, idx) =>
            typeof page === "number" ? (
              <PaginationButton
                key={page}
                page={page}
                currentPage={currentPage}
                onPageChange={onPageChange}
              />
            ) : (
              <span
                key={`ellipsis-${idx}`}
                className="mt-2.5 px-2 text-muted select-none"
                aria-hidden="true"
                role="presentation"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <FaEllipsis />
              </span>
            ),
          )}
          <ActionButton
            variant="secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            ariaLabel={t("pagination.nextAria")}
            className="min-h-[2.5rem] text-base"
          >
            <span
              className={`inline-flex items-center gap-1${
                currentPage === totalPages ? " text-muted" : ""
              }`}
              style={{ lineHeight: 1 }}
            >
              <span className="align-middle">{t("pagination.next")}</span>
              <DirectionalIcon
                variant="chevron"
                direction="next"
                className="text-xs align-middle mt-0.5 ms-1"
              />
            </span>
          </ActionButton>
        </div>
      </div>
      <div className="absolute end-0 w-[220px] h-full" />
    </div>
  );
}
