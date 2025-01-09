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
  return (
    <div className="flex items-center gap-4">
      <FileInput fileName={fileName} onFileChange={onFileChange} />
      <Button disabled={isUploading}>
        <Upload className="w-4 h-4 mr-2" />
        Upload CSV
      </Button>
      <Button variant="destructive" onClick={onClear}>
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  );
};