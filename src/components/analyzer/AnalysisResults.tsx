import { Card } from "@/components/ui/card";
import { RuleMatch } from "@/types/analyzer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface AnalysisResultsProps {
  matches: RuleMatch[];
}

export const AnalysisResults = ({ matches }: AnalysisResultsProps) => {
  if (matches.length === 0) return null;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
      <div className="space-y-6">
        {matches.map((match, index) => (
          <Collapsible key={index} className="space-y-4 border-b pb-4 last:border-b-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 bg-green-50 text-green-700 rounded hover:bg-green-100">
              <span>Matched Rule #{match.ruleIndex + 1}: {match.ruleName}</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="space-y-2 mt-4">
                {match.matchDetails.map((detail, detailIndex) => (
                  <div key={detailIndex} className="p-2 bg-gray-50 rounded text-sm">
                    {detail}
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                {match.output.type && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">Visit nature</span>
                    <span className="text-gray-600">{match.output.type}</span>
                  </div>
                )}
                {match.output.platform && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">Platform</span>
                    <span className="text-gray-600">{match.output.platform}</span>
                  </div>
                )}
                {match.output.channel && (
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">Channel</span>
                    <span className="text-gray-600">{match.output.channel}</span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </Card>
  );
};