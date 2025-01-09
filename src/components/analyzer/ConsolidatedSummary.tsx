import { RuleMatch } from "@/types/analyzer";

interface ConsolidatedSummaryProps {
  matches: RuleMatch[];
}

export const ConsolidatedSummary = ({ matches }: ConsolidatedSummaryProps) => {
  if (matches.length === 0) return null;

  // Get unique values for each category
  const uniqueTypes = [...new Set(matches.map(match => match.output.type).filter(Boolean))];
  const uniquePlatforms = [...new Set(matches.map(match => match.output.platform).filter(Boolean))];
  const uniqueChannels = [...new Set(matches.map(match => match.output.channel).filter(Boolean))];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-4">Consolidated Summary</h3>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Visit Nature</h4>
          <div className="space-y-1">
            {uniqueTypes.map((type, index) => (
              <div key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded">
                {type}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Platforms</h4>
          <div className="space-y-1">
            {uniquePlatforms.map((platform, index) => (
              <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded">
                {platform}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Channels</h4>
          <div className="space-y-1">
            {uniqueChannels.map((channel, index) => (
              <div key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded">
                {channel}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};