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
        className="max-w-md opacity-0 absolute inset-0 cursor-pointer"
        value=""
      />
      <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        {fileName || "No file chosen"}
      </div>
    </div>
  );
};