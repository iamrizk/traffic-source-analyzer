import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { TestCaseRow } from "./TestCaseRow";
import { TablePagination } from "./TablePagination";
import { ITEMS_PER_PAGE } from "./utils/constants";

interface TestCase {
  url: string;
  referralSource: string;
}

interface TestCasesTableProps {
  testCases: TestCase[];
}

export const TestCasesTable = ({ testCases }: TestCasesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return testCases.slice(startIndex, endIndex);
  }, [testCases, currentPage]);

  const totalPages = Math.ceil(testCases.length / ITEMS_PER_PAGE);

  if (testCases.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-8">
        <h3 className="text-xl font-semibold whitespace-nowrap">
          Uploaded Test Cases ({testCases.length})
        </h3>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">No.</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Referral Source</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((testCase, index) => (
              <TestCaseRow
                key={index}
                testCase={testCase}
                index={index}
                currentPage={currentPage}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};