import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, ExternalLink, Minus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { normalizeUrl } from "../analyzer/utils/testCaseUtils";

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
    navigate("/");
    toast.success("Test case loaded", {
      description: "The URL and referral source have been loaded into the analyzer.",
    });
  };

  // Check if this URL has been analyzed by looking at the testCases in localStorage
  const isAnalyzed = () => {
    try {
      const savedTestCases = localStorage.getItem('testCases');
      if (!savedTestCases) return false;
      
      const testCases = JSON.parse(atob(savedTestCases));
      const normalizedUrl = normalizeUrl(testCase.url);
      
      return testCases.some((tc: any) => 
        normalizeUrl(tc.u) === normalizedUrl && tc.viewed === true
      );
    } catch (error) {
      console.error('Error checking analyzed status:', error);
      return false;
    }
  };

  return (
    <TableRow className="group relative">
      <TableCell className="font-medium">
        {(currentPage - 1) * itemsPerPage + index + 1}
      </TableCell>
      <TableCell>
        {isAnalyzed() ? (
          <Eye className="w-4 h-4 text-primary" />
        ) : (
          <Minus className="w-4 h-4 text-muted-foreground" />
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