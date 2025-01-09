import { Card } from "@/components/ui/card";
import { Check, X, AlertTriangle, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
      const urlParamsMap: Record<string, string> = {};
      
      urlParams.forEach((value, key) => {
        urlParamsMap[key] = value.toLowerCase();
      });
      
      return Object.entries(parameters).map(([key, value]) => {
        const isPresent = key in urlParamsMap;
        const matchesValue = urlParamsMap[key] === value.toLowerCase();
        
        return {
          key,
          value,
          isPresent,
          matchesValue,
          urlValue: urlParamsMap[key]
        };
      });
    } catch (error) {
      console.error('Error parsing URL:', error);
      return [];
    }
  };

  const auditResults = auditParameters();
  const allPassed = auditResults.every(result => result.isPresent && result.matchesValue);

  if (auditResults.length === 0) return null;

  return (
    <Card className="p-6" data-audit-status={allPassed ? "passed" : "failed"}>
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">Parameters Audit</h3>
            {allPassed ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="space-y-2 mt-4">
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};