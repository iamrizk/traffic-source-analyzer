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
    <div className="space-y-6">
      {summary.types.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Visit Nature</h4>
          <ul className="list-disc pl-6 space-y-1">
            {summary.types.map((type, index) => (
              <li key={index} className="text-gray-700">
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {summary.platforms.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Platforms</h4>
          <ul className="list-disc pl-6 space-y-1">
            {summary.platforms.map((platform, index) => (
              <li key={index} className="text-gray-700">
                {platform}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {summary.channels.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">Channels</h4>
          <ul className="list-disc pl-6 space-y-1">
            {summary.channels.map((channel, index) => (
              <li key={index} className="text-gray-700">
                {channel}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};