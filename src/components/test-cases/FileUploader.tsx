import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FileInput } from "./FileInput";
import { UploadProgress } from "./UploadProgress";
import { parseCSVData } from "./utils/fileHandling";

interface FileUploaderProps {
  onUploadSuccess: (testCases: { url: string; referralSource: string }[]) => void;
  onClear: () => void;
}

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit to be safe

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

    let progressInterval: NodeJS.Timeout;

    progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const nextProgress = prev + 5;
        if (nextProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return nextProgress;
      });
    }, 300);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCSVData(text);

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      setUploadProgress(100);

      if (parsedData.length === 0) {
        toast.error("Invalid CSV format", {
          description: "No valid URLs found in the file",
        });
      } else {
        const newDataSize = new Blob([JSON.stringify(parsedData)]).size;
        if (newDataSize > MAX_STORAGE_SIZE) {
          toast.error("File too large", {
            description: "The uploaded file exceeds the storage limit. Please use a smaller file.",
          });
        } else {
          onUploadSuccess(parsedData);
          toast.success("File uploaded successfully", {
            description: `Loaded ${parsedData.length} test cases`,
          });
        }
      }

      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      });
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