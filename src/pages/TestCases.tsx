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

interface TestCase {
  url: string;
  referralSource: string;
}

const TEST_CASE_FILES = [
  'test-case-1.csv',
  'test-case-2.csv',
  'test-case-3.csv',
  'test-case-4.csv'
];

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const loadSampleTestCases = async (filename: string) => {
    try {
      const response = await fetch(`/test-cases/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}`);
      }
      
      const text = await response.text();
      const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      
      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      let startIndex = 0;
      let urlIndex = 0;
      let sourceIndex = 1;

      // Try to detect headers first
      const possibleHeaders = lines[0].toLowerCase().split(',').map(h => h.trim());
      const hasHeaders = possibleHeaders.some(h => 
        h.includes('url') || h.includes('link') || 
        h.includes('source') || h.includes('referral')
      );

      if (hasHeaders) {
        startIndex = 1;
        urlIndex = possibleHeaders.findIndex(h => 
          h.includes('url') || h.includes('link') || h.includes('address')
        );
        sourceIndex = possibleHeaders.findIndex(h => 
          h.includes('source') || h.includes('referral') || h.includes('referrer') || h.includes('origin')
        );

        // If headers were not found, fallback to first two columns
        if (urlIndex === -1) urlIndex = 0;
        if (sourceIndex === -1) sourceIndex = 1;
      }

      const parsedTestCases = lines.slice(startIndex)
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          if (values.length >= 2) {
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
          testCase.url.length > 0 &&
          testCase.url.includes('.')  // Basic URL validation
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

  useEffect(() => {
    const savedTestCases = localStorage.getItem('testCases');
    if (savedTestCases) {
      try {
        setTestCases(JSON.parse(savedTestCases));
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