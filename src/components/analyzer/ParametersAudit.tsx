import { Card } from "@/components/ui/card";
import { Check, X, AlertTriangle } from "lucide-react";

interface ParametersAuditProps {
  url: string;
  parameters: Record<string, string>;
}

export const ParametersAudit = ({ url, parameters }: ParametersAuditProps) => {
  if (!url || Object.keys(parameters).length === 0) return null;

  const auditParameters = () => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const urlParams = new URLSearchParams(urlObj.search);
      const urlParamsMap = Object.fromEntries(urlParams.entries());
      
      return Object.entries(parameters).map(([key, value]) => {
        const isPresent = key in urlParamsMap;
        const matchesValue = urlParamsMap[key] === value;
        
        return {
          key,
          value,
          isPresent,
          matchesValue,
          urlValue: urlParamsMap[key]
        };
      });
    } catch (error) {
      return [];
    }
  };

  const auditResults = auditParameters();

  if (auditResults.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Parameters Audit</h3>
      <div className="space-y-2">
        {auditResults.map(({ key, value, isPresent, matchesValue, urlValue }, index) => (
          <div 
            key={key}
            className="flex items-center gap-4 p-2 bg-gray-50 rounded"
          >
            {isPresent && matchesValue ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : isPresent ? (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-gray-500 font-medium w-6">{index + 1}.</span>
            <div className="flex-1">
              <div className="font-medium">{key}</div>
              {isPresent && !matchesValue && (
                <div className="text-sm text-yellow-600">
                  Expected: {value}
                  <br />
                  Found in URL: {urlValue}
                </div>
              )}
              {!isPresent && (
                <div className="text-sm text-red-600">
                  Parameter not found in URL
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};