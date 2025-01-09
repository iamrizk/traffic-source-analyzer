import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileUploader } from "@/components/test-cases/FileUploader";
import { TestCasesTable } from "@/components/test-cases/TestCasesTable";

interface TestCase {
  url: string;
  referralSource: string;
}

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit to be safe

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
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

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Test Cases</h2>
          <p className="text-muted-foreground">
            Upload a CSV file with URL and Referral Source columns to test multiple URLs at once.
          </p>
          <FileUploader 
            onUploadSuccess={handleUploadSuccess}
            onClear={handleClear}
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