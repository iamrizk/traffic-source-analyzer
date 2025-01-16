import { RuleMatch } from "@/types/analyzer";

interface ConsolidatedSummaryProps {
  matches: RuleMatch[];
}

export const ConsolidatedSummary = ({ matches }: ConsolidatedSummaryProps) => {
  if (matches.length === 0) return null;

  // Get unique values with their counts for each category
  const getUniqueValuesWithCounts = (key: 'type' | 'platform' | 'channel') => {
    const counts = matches.reduce((acc, match) => {
      const value = match.output[key];
      if (value) {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts);
  };

  const typeMatches = getUniqueValuesWithCounts('type');
  const platformMatches = getUniqueValuesWithCounts('platform');
  const channelMatches = getUniqueValuesWithCounts('channel');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-4">Consolidated Summary</h3>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Visit Nature</h4>
          <div className="space-y-1">
            {typeMatches.map(([type, count], index) => (
              <div key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded">
                {type} ({count})
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Platforms</h4>
          <div className="space-y-1">
            {platformMatches.map(([platform, count], index) => (
              <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded">
                {platform} ({count})
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Channels</h4>
          <div className="space-y-1">
            {channelMatches.map(([channel, count], index) => (
              <div key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded">
                {channel} ({count})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};