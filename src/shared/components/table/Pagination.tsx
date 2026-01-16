import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { SelectInput, ActionButton } from "@components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCount: number;
  onPageSizeChange?: (size: number) => void;
  itemLabel?: string;
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
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Calculate the number of trips shown on this page
  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);
  const showingCount = endIdx - startIdx + 1;
  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <div className="relative flex items-center my-4 w-full min-h-[40px]">
      <div className="absolute left-4 flex items-center gap-4 pl-2">
        <span className="text-muted whitespace-nowrap flex items-center gap-1">
          Showing
          {onPageSizeChange ? (
            <>
              <div className="w-[65px]">
                <SelectInput
                  value={pageSize}
                  onChange={(val) => onPageSizeChange(Number(val))}
                  options={pageSizeOptions.map((opt) => ({
                    value: opt,
                    label: opt.toString(),
                  }))}
                  placeholder="Page size"
                  aria-label="Select page size"
                />
              </div>
              of {totalCount} {itemLabel}
              {totalCount !== 1 ? "s" : ""}
            </>
          ) : (
            <>
              {showingCount} of {totalCount} {itemLabel}
              {totalCount !== 1 ? "s" : ""}
            </>
          )}
        </span>
      </div>
      <div className="mx-auto flex items-center gap-2">
        <ActionButton
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          ariaLabel="Previous page"
        >
          <span
            className={`inline-flex items-center gap-1${
              currentPage === 1 ? " text-muted" : ""
            }`}
            style={{ lineHeight: 1 }}
          >
            <FaChevronLeft className="text-xs align-middle mt-0.5 mr-1" />
            <span className="align-middle">Back</span>
          </span>
        </ActionButton>
        {pages.map((page) => (
          <ActionButton
            key={page}
            variant={page === currentPage ? "primary" : "secondary"}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            ariaLabel={`Go to page ${page}`}
            className="!px-3"
          >
            {page}
          </ActionButton>
        ))}
        <ActionButton
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ariaLabel="Next page"
        >
          <span
            className={`inline-flex items-center gap-1${
              currentPage === totalPages ? " text-muted" : ""
            }`}
            style={{ lineHeight: 1 }}
          >
            <span className="align-middle">Next</span>
            <FaChevronRight className="text-xs align-middle mt-0.5 ml-1" />
          </span>
        </ActionButton>
      </div>
    </div>
  );
}
