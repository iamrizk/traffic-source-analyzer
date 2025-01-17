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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-4">Origins of Session</h3>
      <div className="space-y-2">
        {type && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Visit Nature:</span>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded">{type}</span>
          </div>
        )}
        {platform && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Platform:</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded">{platform}</span>
          </div>
        )}
        {channel && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Channel:</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded">{channel}</span>
          </div>
        )}
      </div>
    </div>
  );
};