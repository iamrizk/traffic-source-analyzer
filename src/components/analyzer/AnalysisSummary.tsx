import { RuleMatch } from "@/types/analyzer";

interface AnalysisSummaryProps {
  matches: RuleMatch[];
}

export const AnalysisSummary = ({ matches }: AnalysisSummaryProps) => {
  if (matches.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
        No rules matched the analyzed URL.
      </div>
    );
  }

  const getSummary = (matches: RuleMatch[]) => {
    const types = matches
      .filter(match => match.output.type)
      .map(match => `${match.output.type} (Rule #${match.ruleIndex + 1})`);
    
    const platforms = matches
      .filter(match => match.output.platform)
      .map(match => `${match.output.platform} (Rule #${match.ruleIndex + 1})`);
    
    const channels = matches
      .filter(match => match.output.channel)
      .map(match => `${match.output.channel} (Rule #${match.ruleIndex + 1})`);

    return { types, platforms, channels };
  };

  const summary = getSummary(matches);

  return (
    <div className="space-y-4">
      {summary.types.length > 0 && (
        <div className="space-y-2">
          <span className="font-medium">Traffic Nature:</span>
          <div className="pl-4">
            {summary.types.join(", ")}
          </div>
        </div>
      )}
      {summary.platforms.length > 0 && (
        <div className="space-y-2">
          <span className="font-medium">Platforms:</span>
          <div className="pl-4">
            {summary.platforms.join(", ")}
          </div>
        </div>
      )}
      {summary.channels.length > 0 && (
        <div className="space-y-2">
          <span className="font-medium">Channels:</span>
          <div className="pl-4">
            {summary.channels.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
};