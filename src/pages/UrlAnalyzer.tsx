import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRules } from "@/hooks/useRules";
import { RuleDisplay } from "@/components/rule/RuleDisplay";

interface AnalysisResult {
  url: string;
  parameters: Record<string, string>;
  referral: string | null;
  output: {
    trafficNature: string;
    platform: string;
    channel: string;
  };
}

const UrlAnalyzer = () => {
  const { rules } = useRules();
  const [url, setUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const parseUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      const parameters: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        parameters[key] = value;
      });
      return {
        parameters,
        referral: document.referrer || null,
      };
    } catch (error) {
      return {
        parameters: {},
        referral: document.referrer || null,
      };
    }
  };

  const analyzeUrl = (url: string) => {
    const { parameters, referral } = parseUrl(url);

    for (const rule of rules) {
      let conditionsMet = false;

      if (rule.conditions.length === 0) {
        conditionsMet = true;
      } else if (rule.conditionsOperator === "and") {
        conditionsMet = rule.conditions.every((condition) => {
          if (condition.type === "parameter") {
            const paramExists = condition.parameter in parameters;

            switch (condition.operator) {
              case "exists":
                return paramExists;
              case "not_exists":
                return !paramExists;
              case "equals":
                return paramExists && parameters[condition.parameter] === condition.value;
              case "not_equals":
                return paramExists && parameters[condition.parameter] !== condition.value;
              case "not_present":
                return !paramExists;
              default:
                return false;
            }
          } else if (condition.type === "referral") {
            switch (condition.operator) {
              case "equals":
                return referral === condition.value;
              case "contains":
                return referral?.includes(condition.value) ?? false;
              case "not_present":
                return !referral;
              default:
                return false;
            }
          }
          return false;
        });
      } else {
        conditionsMet = rule.conditions.some((condition) => {
          if (condition.type === "parameter") {
            const paramExists = condition.parameter in parameters;

            switch (condition.operator) {
              case "exists":
                return paramExists;
              case "not_exists":
                return !paramExists;
              case "equals":
                return paramExists && parameters[condition.parameter] === condition.value;
              case "not_equals":
                return paramExists && parameters[condition.parameter] !== condition.value;
              case "not_present":
                return !paramExists;
              default:
                return false;
            }
          } else if (condition.type === "referral") {
            switch (condition.operator) {
              case "equals":
                return referral === condition.value;
              case "contains":
                return referral?.includes(condition.value) ?? false;
              case "not_present":
                return !referral;
              default:
                return false;
            }
          }
          return false;
        });
      }

      if (conditionsMet) {
        setAnalysisResult({
          url,
          parameters,
          referral,
          output: {
            trafficNature: rule.output.trafficNature,
            platform: rule.output.platform,
            channel: rule.output.channel,
          },
        });
        return;
      }
    }

    setAnalysisResult({
      url,
      parameters,
      referral,
      output: {
        trafficNature: "Unknown",
        platform: "Unknown",
        channel: "Unknown",
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      analyzeUrl(url);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">URL Analyzer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze"
              className="flex-1"
            />
            <Button type="submit">Analyze</Button>
          </div>
        </form>
      </Card>

      {analysisResult && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Analysis Result</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">URL</h4>
              <p className="text-sm text-gray-600">{analysisResult.url}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Parameters</h4>
              {Object.keys(analysisResult.parameters).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(analysisResult.parameters).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-600">
                      {key}: {value}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No parameters found</p>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Referral</h4>
              <p className="text-sm text-gray-600">
                {analysisResult.referral || "No referral"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Classification</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Traffic Nature: {analysisResult.output.trafficNature}
                </p>
                <p className="text-sm text-gray-600">
                  Platform: {analysisResult.output.platform}
                </p>
                <p className="text-sm text-gray-600">
                  Channel: {analysisResult.output.channel}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UrlAnalyzer;