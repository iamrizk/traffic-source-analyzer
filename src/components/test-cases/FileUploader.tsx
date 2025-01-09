import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onUploadSuccess: (testCases: { url: string; referralSource: string }[]) => void;
  onClear: () => void;
}

const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit to be safe

export const FileUploader = ({ onUploadSuccess, onClear }: FileUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

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

    setFileName(file.name);
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
      const lines = text.split("\n");
      
      const startIndex = isValidUrl(lines[0].split(",")[0].trim()) ? 0 : 1;
      
      const parsedData: { url: string; referralSource: string }[] = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "") continue;

        const [url, referralSource] = line.split(",").map(item => item.trim());
        
        if (isValidUrl(url)) {
          parsedData.push({ url, referralSource });
        }
      }

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
    onClear();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="max-w-md"
          placeholder={fileName || "Choose a file..."}
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
          <Progress 
            value={uploadProgress} 
            className="w-[60%] transition-all duration-500 ease-in-out" 
          />
        </div>
      )}
    </div>
  );
};