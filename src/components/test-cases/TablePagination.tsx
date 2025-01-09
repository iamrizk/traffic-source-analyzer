import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: TablePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent className="gap-4">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={`${
              currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            } whitespace-nowrap`}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="cursor-default whitespace-nowrap min-w-[100px] text-center">
            {currentPage} of {totalPages}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={`${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } whitespace-nowrap`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};