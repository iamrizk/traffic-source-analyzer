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
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}`);
      }
      
      const text = await response.text();
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      
      if (lines.length < 2) {
        throw new Error('CSV file is empty or has no data rows');
      }

      // Get headers and normalize them
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      // Find URL column - check for various possible header names
      const urlIndex = headers.findIndex(h => 
        h === 'url' || 
        h === 'link' || 
        h === 'website' || 
        h === 'address' ||
        h.includes('url') ||
        h.includes('link')
      );

      // Find Source column - check for various possible header names
      const sourceIndex = headers.findIndex(h => 
        h === 'source' || 
        h === 'referral' || 
        h === 'referrer' || 
        h === 'origin' ||
        h.includes('source') ||
        h.includes('referral')
      );

      if (urlIndex === -1) {
        throw new Error('URL column not found in CSV. Please ensure there is a column with "url" or "link" in its name.');
      }

      if (sourceIndex === -1) {
        throw new Error('Source column not found in CSV. Please ensure there is a column with "source" or "referral" in its name.');
      }

      const parsedTestCases = lines.slice(1)
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          if (values.length >= Math.max(urlIndex, sourceIndex) + 1) {
            return {
              url: values[urlIndex],
              referralSource: values[sourceIndex] || 'direct'
            };
          }
          return null;
        })
        .filter((testCase): testCase is TestCase => 
          testCase !== null && 
          testCase.url && 
          testCase.url.length > 0
        );

      if (parsedTestCases.length === 0) {
        throw new Error('No valid test cases found in file');
      }

      setTestCases(parsedTestCases);
      localStorage.setItem('testCases', JSON.stringify(parsedTestCases));
      toast.success("Sample test cases loaded", {
        description: `Loaded ${parsedTestCases.length} test cases from ${filename}`,
      });
    } catch (error) {
      console.error('Error loading sample test cases:', error);
      toast.error("Error loading sample test cases", {
        description: error instanceof Error ? error.message : "Failed to load sample test cases",
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