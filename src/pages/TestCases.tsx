import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUploader } from "@/components/test-cases/FileUploader";
import { TestCasesTable } from "@/components/test-cases/TestCasesTable";
import { Import } from "lucide-react";

interface TestCase {
  url: string;
  referralSource: string;
}

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

  const handleUploadSuccess = (newTestCases: TestCase[]) => {
    setTestCases(newTestCases);
  };

  const handleClear = () => {
    setTestCases([]);
    localStorage.removeItem('testCases');
    toast.success("Test cases cleared", {
      description: "All test cases have been removed",
    });
  };

  const loadSampleTestCases = async () => {
    try {
      const response = await fetch('/test-cases/test-case-1.csv');
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
        description: `Loaded ${parsedTestCases.length} test cases`,
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
          <h2 className="text-2xl font-bold">Test Cases</h2>
          <p className="text-muted-foreground">
            Upload a CSV file with URL and Referral Source columns to test multiple URLs at once.
          </p>
          <div className="flex flex-col gap-4">
            <FileUploader 
              onUploadSuccess={handleUploadSuccess}
              onClear={handleClear}
            />
            <Button onClick={loadSampleTestCases} variant="outline">
              <Import className="w-4 h-4 mr-2" />
              Load Sample Test Cases
            </Button>
          </div>
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