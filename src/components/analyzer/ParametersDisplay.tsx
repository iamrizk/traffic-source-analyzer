import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ParametersDisplayProps {
  parameters: Record<string, string>;
}

export const ParametersDisplay = ({ parameters }: ParametersDisplayProps) => {
  if (Object.keys(parameters).length === 0) return null;

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast("Copied to clipboard!", {
        description: "Parameter value has been copied to your clipboard.",
      });
    } catch (err) {
      toast("Failed to copy", {
        description: "Could not copy the value to clipboard.",
      });
    }
  };

  const paramCount = Object.keys(parameters).length;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">
        Parameters ({paramCount})
      </h3>
      <div className="space-y-2">
        {Object.entries(parameters).map(([key, value]) => (
          <div 
            key={key} 
            className="grid grid-cols-[1fr,2fr] gap-4 items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium truncate">{key}</span>
            <span 
              className="text-gray-600 truncate cursor-pointer"
              title={value}
              onClick={() => copyToClipboard(value)}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};