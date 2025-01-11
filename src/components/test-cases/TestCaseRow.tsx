import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  const handleCopy = (text: string, type: "URL" | "Referral Source") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleAnalyze = () => {
    localStorage.setItem("analyzer_url", testCase.url);
    localStorage.setItem("analyzer_referral", testCase.referralSource || "");
    navigate("/analyzer");
    toast.success("Test case loaded", {
      description: "The URL and referral source have been loaded into the analyzer.",
    });
  };

  return (
    <TableRow className="group relative">
      <TableCell className="font-medium">
        {(currentPage - 1) * itemsPerPage + index + 1}
      </TableCell>
      <TableCell>
        {testCase.viewed && (
          <Eye className="w-4 h-4 text-muted-foreground" />
        )}
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
      <TableCell className="w-[100px] opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={handleAnalyze}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Analyze
        </Button>
      </TableCell>
    </TableRow>
  );
};