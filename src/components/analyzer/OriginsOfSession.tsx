import { useState, useEffect } from "react";
import { RuleMatch } from "@/types/analyzer";
import { generateNarrative } from "@/utils/perplexity";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface OriginsOfSessionProps {
  matches: RuleMatch[];
}

export const OriginsOfSession = ({ matches }: OriginsOfSessionProps) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openrouter_api_key") || "");
  const [narrative, setNarrative] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Auto-generate narrative when matches change and API key is present
    if (matches.length > 0 && apiKey) {
      handleGenerateNarrative();
    }
  }, [matches]); // Deliberately omitting apiKey to prevent infinite loop

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

  const handleGenerateNarrative = async () => {
    if (!apiKey) {
      toast.error("Please enter your OpenRouter API key");
      return;
    }

    setIsGenerating(true);
    try {
      const firstMatch = matches[0];
      const generatedNarrative = await generateNarrative(
        apiKey,
        firstMatch.conditions,
        firstMatch.output
      );

      if (generatedNarrative) {
        setNarrative(generatedNarrative);
        localStorage.setItem("openrouter_api_key", apiKey);
        toast.success("Narrative generated successfully");
      }
    } catch (error) {
      toast.error("Error generating narrative");
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-4">Origins of Session</h3>
      
      {!apiKey && (
        <div className="mb-4 flex gap-4">
          <Input
            type="password"
            placeholder="Enter your OpenRouter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="max-w-md"
          />
          <Button 
            onClick={handleGenerateNarrative}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Narrative"}
          </Button>
        </div>
      )}

      {narrative ? (
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {narrative}
        </p>
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {apiKey ? "Generating narrative..." : "Enter your OpenRouter API key to generate a narrative."}
        </p>
      )}

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