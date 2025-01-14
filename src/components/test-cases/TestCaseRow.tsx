import { TableCell, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TestCaseRowProps {
  testCase: {
    url: string;
    referralSource: string;
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
    try {
      localStorage.setItem("analyzer_url", testCase.url);
      localStorage.setItem("analyzer_referral", testCase.referralSource || "");
      navigate("/url-analyzer");
      toast.success("Test case loaded", {
        description: "The URL and referral source have been loaded into the analyzer.",
      });
    } catch (error) {
      console.error("Error navigating to analyzer:", error);
      toast.error("Failed to load test case", {
        description: "There was an error loading the test case. Please try again.",
      });
    }
  };

  return (
    <TableRow className="group relative">
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