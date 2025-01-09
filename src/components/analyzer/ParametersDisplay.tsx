import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { RuleMatch } from "@/types/analyzer";

interface ParametersDisplayProps {
  parameters: Record<string, string>;
  matches: RuleMatch[];
}

export const ParametersDisplay = ({ parameters, matches }: ParametersDisplayProps) => {
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

  const isParameterMatched = (paramName: string, paramValue: string) => {
    for (const match of matches) {
      for (const condition of match.conditions) {
        if (condition.type === 'parameter' && condition.parameter === paramName) {
          if (condition.operator === 'exists') return true;
          if (condition.operator === 'not_exists') return false;
          if (condition.operator === 'equals' && condition.value === paramValue) return true;
          if (condition.operator === 'not_equals' && condition.value !== paramValue) return true;
        }
      }
    }
    return false;
  };

  const paramCount = Object.keys(parameters).length;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">
        Parameters ({paramCount})
      </h3>
      <div className="space-y-2">
        {Object.entries(parameters).map(([key, value], index) => {
          const isMatched = isParameterMatched(key, value);
          return (
            <div 
              key={key} 
              className="grid grid-cols-[auto,auto,1fr,2fr] gap-4 items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-gray-500 font-medium w-6">{index + 1}.</span>
              {isMatched ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className="font-medium truncate">{key}</span>
              <span 
                className="text-gray-600 truncate cursor-pointer"
                title={value}
                onClick={() => copyToClipboard(value)}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};