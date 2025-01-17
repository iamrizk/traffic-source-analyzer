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

  // Create a narrative explanation based on the rules
  const createNarrative = () => {
    const firstMatch = matches[0];
    let narrative = "The user visited ";

    // Add referral information if available
    const referralCondition = firstMatch.conditions.find(c => c.type === 'referral');
    if (referralCondition) {
      if (referralCondition.operator === 'not_present') {
        narrative += "the page directly without any referral source ";
      } else if (referralCondition.operator === 'equals') {
        narrative += `the page from ${referralCondition.value} `;
      } else if (referralCondition.operator === 'contains') {
        narrative += `the page via a source containing "${referralCondition.value}" `;
      }
    }

    // Add platform information
    if (platform) {
      narrative += `using the ${platform.toLowerCase()} platform. `;
    }

    // Add parameter-based information
    const parameterConditions = firstMatch.conditions.filter(c => c.type === 'parameter');
    if (parameterConditions.length > 0) {
      narrative += "The landing URL contained ";
      const paramDescriptions = parameterConditions.map(c => {
        if (c.operator === 'not_present') {
          return "no URL parameters";
        } else if (c.operator === 'exists') {
          return `the parameter "${c.parameter}"`;
        } else if (c.operator === 'equals') {
          return `the parameter "${c.parameter}" with value "${c.value}"`;
        } else if (c.operator === 'not_equals') {
          return `the parameter "${c.parameter}" with a value different from "${c.value}"`;
        }
        return "";
      }).filter(Boolean);
      
      narrative += paramDescriptions.join(" and ") + ". ";
    }

    // Add conclusion about visit type and channel
    if (type || channel) {
      narrative += "Based on these characteristics, ";
      if (type) {
        narrative += `this was identified as a ${type.toLowerCase()} visit `;
      }
      if (channel) {
        narrative += type ? 
          `through the ${channel.toLowerCase()} channel` : 
          `originating from the ${channel.toLowerCase()} channel`;
      }
      narrative += ".";
    }

    return narrative;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-4">Origins of Session</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {createNarrative()}
      </p>
      <div className="mt-4 space-y-2">
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