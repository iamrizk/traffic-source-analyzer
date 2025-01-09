import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { FileInput } from "./FileInput";

interface UploadControlsProps {
  fileName: string;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const UploadControls = ({
  fileName,
  isUploading,
  onFileChange,
  onClear,
}: UploadControlsProps) => {
  const handleClear = () => {
    localStorage.clear(); // Clear all local storage
    onClear(); // Call the original onClear function
  };

  return (
    <div className="flex items-center gap-4">
      <FileInput fileName={fileName} onFileChange={onFileChange} />
      <Button disabled={isUploading}>
        <Upload className="w-4 h-4 mr-2" />
        Upload CSV
      </Button>
      <Button variant="destructive" onClick={handleClear}>
        <Trash2 className="w-4 h-4 mr-2" />
        Clear All Test Cases
      </Button>
    </div>
  );
};