import { Card } from "@/components/ui/card";
import { RuleMatch } from "@/types/analyzer";

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
          <div key={index} className="space-y-4 border-b pb-4 last:border-b-0">
            <div className="p-2 bg-green-50 text-green-700 rounded">
              Matched Rule #{match.ruleIndex + 1}
            </div>
            
            <div className="space-y-2">
              {match.matchDetails.map((detail, detailIndex) => (
                <div key={detailIndex} className="p-2 bg-gray-50 rounded text-sm">
                  {detail}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {match.output.type && (
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">Traffic Nature</span>
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
          </div>
        ))}
      </div>
    </Card>
  );
};