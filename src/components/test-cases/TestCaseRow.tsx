import { TableCell, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { toast } from "sonner";

interface TestCaseRowProps {
  testCase: {
    url: string;
    referralSource: string;
    viewed?: boolean;
  };
  index: number;
  currentPage: number;
  itemsPerPage: number;
}

export const TestCaseRow = ({
  testCase,
  index,
  currentPage,
  itemsPerPage,
}: TestCaseRowProps) => {
  const handleCopy = (text: string, type: "URL" | "Referral Source") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {(currentPage - 1) * itemsPerPage + index + 1}
      </TableCell>
      <TableCell 
        className="truncate max-w-[300px] cursor-pointer hover:bg-muted/50"
        onClick={() => handleCopy(testCase.url, "URL")}
      >
        <div className="select-text">
          {testCase.url}
        </div>
      </TableCell>
      <TableCell 
        className="truncate max-w-[300px] cursor-pointer hover:bg-muted/50"
        onClick={() => handleCopy(testCase.referralSource || "-", "Referral Source")}
      >
        <div className="select-text">
          {testCase.referralSource || "-"}
        </div>
      </TableCell>
      <TableCell>
        {testCase.viewed && (
          <Eye className="w-4 h-4 text-muted-foreground" />
        )}
      </TableCell>
    </TableRow>
  );
};