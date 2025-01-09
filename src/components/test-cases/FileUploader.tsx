import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FileInput } from "./FileInput";
import { UploadProgress } from "./UploadProgress";
import { parseCSVData, saveTestCases } from "./utils/fileHandling";

interface FileUploaderProps {
  onUploadSuccess: (testCases: { url: string; referralSource: string }[]) => void;
  onClear: () => void;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB limit
const MAX_ROWS = 9000; // Maximum number of rows to process

export const FileUploader = ({ onUploadSuccess, onClear }: FileUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const savedFileName = localStorage.getItem('uploadedFileName');
    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please use a smaller file.`,
      });
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast.error("Invalid file type", {
        description: "Please upload a CSV file",
      });
      return;
    }

    setFileName(file.name);
    localStorage.setItem('uploadedFileName', file.name);
    
    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCSVData(text);

      if (parsedData.length === 0) {
        toast.error("Invalid CSV format", {
          description: "No valid URLs found in the file",
        });
      } else if (parsedData.length > MAX_ROWS) {
        toast.warning(`Only the first ${MAX_ROWS} rows will be processed`, {
          description: `${parsedData.length - MAX_ROWS} rows were dropped due to limits`,
        });
        const truncatedData = parsedData.slice(0, MAX_ROWS);
        if (saveTestCases(truncatedData)) {
          onUploadSuccess(truncatedData);
          toast.success("File uploaded successfully", {
            description: `Loaded ${truncatedData.length} test cases`,
          });
        }
      } else {
        if (saveTestCases(parsedData)) {
          onUploadSuccess(parsedData);
          toast.success("File uploaded successfully", {
            description: `Loaded ${parsedData.length} test cases`,
          });
        }
      }

      setIsUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(Math.min(90, progress));
      }
    };

    reader.readAsText(file);
  };

  const handleClear = () => {
    setFileName("");
    localStorage.removeItem('uploadedFileName');
    onClear();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <FileInput fileName={fileName} onFileChange={handleFileUpload} />
        <Button disabled={isUploading}>
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV
        </Button>
        <Button variant="destructive" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
      <UploadProgress isUploading={isUploading} progress={uploadProgress} />
    </div>
  );
};