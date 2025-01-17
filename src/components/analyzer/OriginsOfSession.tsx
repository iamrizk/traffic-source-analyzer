import { RuleMatch } from "@/types/analyzer";

interface OriginsOfSessionProps {
  matches: RuleMatch[];
}

export const OriginsOfSession = ({ matches }: OriginsOfSessionProps) => {
  if (matches.length === 0) return null;

  // Get unique values for each category
  const getUniqueValue = (key: 'type' | 'platform' | 'channel') => {
    const uniqueValues = [...new Set(matches.map(match => match.output[key]).filter(Boolean))];
    return uniqueValues.length === 1 ? uniqueValues[0] : null;
  };

  const type = getUniqueValue('type');
  const platform = getUniqueValue('platform');
  const channel = getUniqueValue('channel');

  if (!type && !platform && !channel) return null;

  const matchCount = matches.length;
  const explanation = `Based on ${matchCount} matching rule${matchCount > 1 ? 's' : ''}, we found:`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-2">Origins of Session</h3>
      <p className="text-sm text-gray-600 mb-4">{explanation}</p>
      <div className="space-y-4">
        {type && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Visit Nature:</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded">{type}</span>
            </div>
            <p className="text-sm text-gray-500 pl-4">
              All {matchCount} matching rules indicate this is a {type.toLowerCase()} visit
            </p>
          </div>
        )}
        {platform && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Platform:</span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">{platform}</span>
            </div>
            <p className="text-sm text-gray-500 pl-4">
              The visitor consistently used {platform.toLowerCase()} across all matches
            </p>
          </div>
        )}
        {channel && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Channel:</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded">{channel}</span>
            </div>
            <p className="text-sm text-gray-500 pl-4">
              Traffic originated from {channel.toLowerCase()} in all {matchCount} matches
            </p>
          </div>
        )}
      </div>
    </div>
  );
};