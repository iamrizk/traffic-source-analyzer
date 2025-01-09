import { useState, useEffect, useCallback } from "react";
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

interface TestCase {
  url: string;
  referralSource: string;
}

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit to be safe

const TEST_CASE_FILES = [
  'test-case-1.csv',
  'test-case-2.csv',
  'test-case-3.csv',
  'test-case-4.csv'
];

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const loadTestCases = useCallback(() => {
    const savedTestCases = localStorage.getItem('testCases');
    if (savedTestCases) {
      try {
        setTestCases(JSON.parse(savedTestCases));
      } catch (error) {
        console.error('Error loading test cases:', error);
        toast.error("Error loading saved test cases");
      }
    }
  }, []);

  useEffect(() => {
    loadTestCases();
  }, [loadTestCases]);

  useEffect(() => {
    try {
      const testCasesString = JSON.stringify(testCases);
      const testCasesSize = new Blob([testCasesString]).size;

      if (testCasesSize > MAX_STORAGE_SIZE) {
        toast.error("Storage limit exceeded", {
          description: "The test cases data is too large to store locally. Consider reducing the number of test cases.",
        });
        return;
      }

      localStorage.setItem('testCases', testCasesString);
    } catch (error) {
      console.error('Error saving test cases:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error("Storage limit exceeded", {
          description: "Unable to save test cases. Please reduce the number of test cases.",
        });
      } else {
        toast.error("Error saving test cases", {
          description: "An unexpected error occurred while saving test cases.",
        });
      }
    }
  }, [testCases]);

  const loadSampleTestCases = async (filename: string) => {
    try {
      const response = await fetch(`/test-cases/${filename}`);
      const text = await response.text();
      
      // Split the CSV into lines and parse
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const urlIndex = headers.findIndex(h => h.toLowerCase().includes('url'));
      const sourceIndex = headers.findIndex(h => h.toLowerCase().includes('source'));
      
      if (urlIndex === -1 || sourceIndex === -1) {
        throw new Error('Invalid CSV format');
      }

      const parsedTestCases = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',');
          return {
            url: values[urlIndex].trim(),
            referralSource: values[sourceIndex].trim()
          };
        });

      if (parsedTestCases.length === 0) {
        throw new Error('No valid test cases found');
      }

      setTestCases(parsedTestCases);
      localStorage.setItem('testCases', JSON.stringify(parsedTestCases));
      toast.success("Sample test cases loaded", {
        description: `Loaded ${parsedTestCases.length} test cases from ${filename}`,
      });
    } catch (error) {
      console.error('Error loading sample test cases:', error);
      toast.error("Error loading sample test cases", {
        description: "Failed to load sample test cases. Please try again.",
      });
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