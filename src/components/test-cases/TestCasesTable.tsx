import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMemo, useState } from "react";

interface TestCase {
  url: string;
  referralSource: string;
}

interface TestCasesTableProps {
  testCases: TestCase[];
}

const ITEMS_PER_PAGE = 10;

export const TestCasesTable = ({ testCases }: TestCasesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return testCases.slice(startIndex, endIndex);
  }, [testCases, currentPage]);

  const totalPages = Math.ceil(testCases.length / ITEMS_PER_PAGE);

  if (testCases.length === 0) return null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Uploaded Test Cases</h3>
        {totalPages > 1 && (
          <Pagination className="mb-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="cursor-default">
                  Page {currentPage} of {totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">URL</TableHead>
              <TableHead className="w-1/2">Referral Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((testCase, index) => (
              <TableRow key={index}>
                <TableCell className="truncate max-w-[300px]">
                  {testCase.url}
                </TableCell>
                <TableCell className="truncate max-w-[300px]">
                  {testCase.referralSource || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};