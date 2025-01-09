import { Card } from "@/components/ui/card";

interface ParametersDisplayProps {
  parameters: Record<string, string>;
}

export const ParametersDisplay = ({ parameters }: ParametersDisplayProps) => {
  if (Object.keys(parameters).length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Parameters</h3>
      <div className="space-y-2">
        {Object.entries(parameters).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-medium">{key}</span>
            <span className="text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};