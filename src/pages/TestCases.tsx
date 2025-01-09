import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/test-cases/FileUploader";
import { TestCasesTable } from "@/components/test-cases/TestCasesTable";
import { Import, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  parseCSVData, 
  saveTestCases, 
  loadTestCases 
} from "@/components/test-cases/utils/fileHandling";

interface TestCase {
  url: string;
  referralSource: string;
}

const TEST_CASE_FILES = [
  '/test-case-1.csv',
  '/test-case-2.csv',
  '/test-case-3.csv',
  '/test-case-4.csv'
];

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Load saved test cases when component mounts
  useEffect(() => {
    const savedTestCases = loadTestCases();
    if (savedTestCases.length > 0) {
      setTestCases(savedTestCases);
    }
  }, []);

  const loadSampleTestCases = async (filename: string) => {
    if (isLoading) return; // Prevent multiple simultaneous loads
    
    try {
      setIsLoading(true);
      setLoadingProgress(10);
      
      // Step 1: Clear all storage and state
      localStorage.clear();
      setTestCases([]);
      await new Promise(resolve => setTimeout(resolve, 200)); // Ensure clearing is complete
      setLoadingProgress(30);
      
      // Step 2: Fetch new data
      const response = await fetch(filename);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
      }
      setLoadingProgress(50);
      
      const text = await response.text();
      setLoadingProgress(70);
      
      const parsedData = parseCSVData(text);
      if (parsedData.length === 0) {
        throw new Error('No valid test cases found in file');
      }
      setLoadingProgress(85);

      // Step 3: Save new data
      if (saveTestCases(parsedData)) {
        setTestCases(parsedData);
        toast.success("Sample test cases loaded", {
          description: `Loaded ${parsedData.length} test cases from ${filename}`,
        });
      }
      
      setLoadingProgress(100);
    } catch (error) {
      console.error('Error loading sample test cases:', error);
      setTestCases([]); // Reset state on error
      toast.error("Error loading sample test cases", {
        description: error instanceof Error ? error.message : "Failed to load sample test cases",
      });
    } finally {
      // Reset loading state after a brief delay to show 100% completion
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Test Cases</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                  <Import className="w-4 h-4 mr-2" />
                  Load Sample Test Cases
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {TEST_CASE_FILES.map((filename) => (
                  <DropdownMenuItem
                    key={filename}
                    onClick={() => loadSampleTestCases(filename)}
                  >
                    {filename}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-muted-foreground">
            Upload a CSV file with URL and Referral Source columns to test multiple URLs at once.
          </p>
          {isLoading && (
            <div className="space-y-2">
              <Progress value={loadingProgress} className="w-full transition-all duration-300" />
              <p className="text-sm text-muted-foreground">Loading test cases...</p>
            </div>
          )}
          <FileUploader 
            onUploadSuccess={setTestCases}
            onClear={() => setTestCases([])}
          />
        </div>
      </Card>

      {testCases.length > 0 && (
        <Card className="p-6">
          <TestCasesTable testCases={testCases} />
        </Card>
      )}
    </div>
  );
};

export default TestCases;
