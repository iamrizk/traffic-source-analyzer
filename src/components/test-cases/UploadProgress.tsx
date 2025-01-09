import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
}

export const UploadProgress = ({ isUploading, progress }: UploadProgressProps) => {
  if (!isUploading) return null;

  return (
    <div className="space-y-2">
      <Progress 
        value={progress} 
        className="w-[60%] transition-all duration-500 ease-in-out" 
      />
    </div>
  );
};