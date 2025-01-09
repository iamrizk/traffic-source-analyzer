import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TestCase {
  url: string;
  referralSource: string;
}

interface TestCasesTableProps {
  testCases: TestCase[];
}

export const TestCasesTable = ({ testCases }: TestCasesTableProps) => {
  if (testCases.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Uploaded Test Cases</h3>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">URL</TableHead>
              <TableHead className="w-1/2">Referral Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testCases.map((testCase, index) => (
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