import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUploader } from "@/components/test-cases/FileUploader";
import { TestCasesTable } from "@/components/test-cases/TestCasesTable";
import { Import, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseCSVData, saveTestCases } from "@/components/test-cases/utils/fileHandling";

interface TestCase {
  url: string;
  referralSource: string;
}

const TEST_CASE_FILES = [
  'test-cases/test-case-1.csv',
  'test-cases/test-case-2.csv',
  'test-cases/test-case-3.csv',
  'test-cases/test-case-4.csv'
];

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const loadSampleTestCases = async (filename: string) => {
    try {
      // Clear localStorage before loading new test cases
      localStorage.clear();
      
      const response = await fetch(`/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      const parsedData = parseCSVData(text);

      if (parsedData.length === 0) {
        throw new Error('No valid test cases found in file');
      }

      if (saveTestCases(parsedData)) {
        setTestCases(parsedData);
        toast.success("Sample test cases loaded", {
          description: `Loaded ${parsedData.length} test cases from ${filename}`,
        });
      }
    } catch (error) {
      console.error('Error loading sample test cases:', error);
      toast.error("Error loading sample test cases", {
        description: error instanceof Error ? error.message : "Failed to load sample test cases",
      });
    }
  };

  useEffect(() => {
    const savedTestCases = localStorage.getItem('testCases');
    if (savedTestCases) {
      try {
        const decompressed = JSON.parse(atob(savedTestCases));
        setTestCases(decompressed);
      } catch (error) {
        console.error('Error loading saved test cases:', error);
        toast.error("Error loading saved test cases");
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Test Cases</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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