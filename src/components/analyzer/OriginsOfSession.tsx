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
        narrative += "the landing page directly without any referral source ";
      } else if (referralCondition.operator === 'equals') {
        narrative += `the landing page from ${referralCondition.value} `;
      } else if (referralCondition.operator === 'contains') {
        narrative += `the landing page via ${referralCondition.value} `;
      }
    } else {
      narrative += "the landing page ";
    }

    // Add parameter-based information with context
    const parameterConditions = firstMatch.conditions.filter(c => c.type === 'parameter');
    if (parameterConditions.length > 0) {
      narrative += "which had ";
      const paramDescriptions = parameterConditions.map(c => {
        if (c.operator === 'not_present') {
          return "no URL parameters";
        } else if (c.operator === 'exists') {
          if (c.parameter === 'twclid') {
            return `the "${c.parameter}" parameter associated with Twitter/X ads`;
          } else if (c.parameter === 'gclid') {
            return `the "${c.parameter}" parameter associated with Google ads`;
          } else if (c.parameter === 'fbclid') {
            return `the "${c.parameter}" parameter associated with Facebook ads`;
          } else {
            return `the parameter "${c.parameter}"`;
          }
        } else if (c.operator === 'equals') {
          return `the parameter "${c.parameter}" set to "${c.value}"`;
        } else if (c.operator === 'not_equals') {
          return `the parameter "${c.parameter}" with a value other than "${c.value}"`;
        }
        return "";
      }).filter(Boolean);
      
      narrative += paramDescriptions.join(" and ") + ". ";
    }

    // Add conclusion about visit type and channel in context
    if (type || channel) {
      narrative += "Based on these characteristics, ";
      if (type === 'Paid' && platform) {
        narrative += `this was identified as a paid visit from ${platform} `;
      } else if (type === 'Organic' && platform) {
        narrative += `this was identified as an organic visit through ${platform} `;
      } else if (type) {
        narrative += `this was identified as a ${type.toLowerCase()} visit `;
      }
      
      if (channel && !narrative.toLowerCase().includes(channel.toLowerCase())) {
        narrative += `through the ${channel.toLowerCase()} channel`;
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