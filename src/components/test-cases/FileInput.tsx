import { Input } from "@/components/ui/input";

interface FileInputProps {
  fileName: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput = ({ fileName, onFileChange }: FileInputProps) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="max-w-md"
        value=""
      />
      {fileName && (
        <div className="absolute inset-0 pointer-events-none flex items-center px-3 text-sm text-muted-foreground">
          {fileName}
        </div>
      )}
    </div>
  );
};