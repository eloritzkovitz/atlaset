import { ActionButton } from "../../inputs/Button/ActionButton";

interface PaginationButtonProps {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationButton({
  page,
  currentPage,
  onPageChange,
}: PaginationButtonProps) {
  return (
    <ActionButton
      key={page}
      variant={page === currentPage ? "primary" : "secondary"}
      onClick={() => onPageChange(page)}
      disabled={page === currentPage}
      ariaLabel={`Go to page ${page}`}
      aria-current={page === currentPage ? "page" : undefined}
      className="!px-3"
    >
      {page}
    </ActionButton>
  );
}
