import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TestCase {
  url: string;
  referralSource: string;
}

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Load test cases from localStorage on component mount
  useEffect(() => {
    const savedTestCases = localStorage.getItem('testCases');
    if (savedTestCases) {
      setTestCases(JSON.parse(savedTestCases));
    }
  }, []);

  // Save test cases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('testCases', JSON.stringify(testCases));
  }, [testCases]);

  const isValidUrl = (urlString: string): boolean => {
    try {
      return Boolean(new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`));
    } catch (e) {
      return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast.error("Invalid file type", {
        description: "Please upload a CSV file",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      
      // Simulate progress
      const totalLines = lines.length;
      let processedLines = 0;

      // Check if first row is header by validating if it contains a URL
      const startIndex = isValidUrl(lines[0].split(",")[0].trim()) ? 0 : 1;
      
      const parsedData: TestCase[] = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "") continue;

        const [url, referralSource] = line.split(",").map(item => item.trim());
        
        if (isValidUrl(url)) {
          parsedData.push({ url, referralSource });
        }

        processedLines++;
        setUploadProgress(Math.round((processedLines / totalLines) * 100));
      }

      if (parsedData.length === 0) {
        toast.error("Invalid CSV format", {
          description: "No valid URLs found in the file",
        });
      } else {
        setTestCases(parsedData);
        toast.success("File uploaded successfully", {
          description: `Loaded ${parsedData.length} test cases`,
        });
      }

      setIsUploading(false);
      setUploadProgress(0);
      
      // Reset the input
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const handleClear = () => {
    setTestCases([]);
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
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="max-w-md"
              />
              <Button disabled={isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
              <Button variant="destructive" onClick={handleClear}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
            {isUploading && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </div>
                <Progress value={uploadProgress} className="w-[60%]" />
              </div>
            )}
          </div>
        </div>
      </Card>

      {testCases.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Uploaded Test Cases</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">URL</TableHead>
                    <TableHead className="w-1/2">Referral Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((testCase, index) => (
                    <TableRow key={index}>
                      <TableCell className="truncate max-w-[300px]">
                        {testCase.url}
                      </TableCell>
                      <TableCell className="truncate max-w-[300px]">
                        {testCase.referralSource || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TestCases;