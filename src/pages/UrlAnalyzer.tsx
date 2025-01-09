import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRules } from "@/hooks/useRules";
import { toast } from "sonner";

interface RuleMatch {
  ruleIndex: number;
  output: {
    type: string;
    platform: string;
    channel: string;
  };
  matchDetails: string[];
}

const UrlAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [matches, setMatches] = useState<RuleMatch[]>([]);

  const { rules } = useRules();

  const parseUrl = () => {
    try {
      const urlObj = new URL(url);
      const params: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      setParameters(params);

      // Analyze based on rules
      const newMatches: RuleMatch[] = [];

      rules.forEach((rule, ruleIndex) => {
        const matchDetails: string[] = [];
        let conditionsMet = 0;

        for (const condition of rule.conditions) {
          if (condition.type === "parameter") {
            const paramExists = condition.parameter in params;
            const paramValue = params[condition.parameter];

            if (condition.operator === "exists" && paramExists) {
              matchDetails.push(`Parameter '${condition.parameter}' exists as required`);
              conditionsMet++;
            } else if (condition.operator === "not_exists" && !paramExists) {
              matchDetails.push(`Parameter '${condition.parameter}' does not exist as required`);
              conditionsMet++;
            } else if (condition.operator === "equals" && paramValue === condition.value) {
              matchDetails.push(`Parameter '${condition.parameter}' value matches '${condition.value}'`);
              conditionsMet++;
            } else if (condition.operator === "not_equals" && paramValue !== condition.value) {
              matchDetails.push(`Parameter '${condition.parameter}' value does not match '${condition.value}'`);
              conditionsMet++;
            } else {
              matchDetails.push(
                condition.operator === "exists" || condition.operator === "not_exists"
                  ? `Parameter '${condition.parameter}' ${condition.operator === "exists" ? "does not exist" : "exists"} (condition not met)`
                  : `Parameter '${condition.parameter}' value ${condition.operator === "equals" ? "does not match" : "matches"} '${condition.value}' (condition not met)`
              );
            }
          } else if (condition.type === "referral") {
            if (
              (condition.operator === "equals" && referralSource === condition.value) ||
              (condition.operator === "contains" && referralSource.includes(condition.value))
            ) {
              matchDetails.push(`Referral source matches '${condition.value}'`);
              conditionsMet++;
            } else {
              matchDetails.push(`Referral source does not match '${condition.value}' (condition not met)`);
            }
          }
        }

        // Check if rule conditions are met based on the operator
        const isRuleMatched = rule.conditionsOperator === "and"
          ? conditionsMet === rule.conditions.length
          : conditionsMet > 0;

        if (isRuleMatched) {
          newMatches.push({
            ruleIndex,
            output: rule.output,
            matchDetails
          });
        }
      });

      setMatches(newMatches);
      toast.success("URL analyzed successfully!");
    } catch (error) {
      toast.error("Invalid URL provided");
    }
  };

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

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">URL Analyzer</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referral">Referral Source</Label>
            <Input
              id="referral"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              placeholder="Enter referral source"
            />
          </div>
          <Button onClick={parseUrl} className="w-full">
            Analyze URL
          </Button>
        </div>
      </Card>

      {Object.keys(parameters).length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Parameters</h3>
          <div className="space-y-2">
            {Object.entries(parameters).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{key}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {matches.length > 0 && (
        <>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
            <div className="space-y-4">
              {(() => {
                const summary = getSummary(matches);
                return (
                  <>
                    {summary.types.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-medium">Types:</span>
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
                  </>
                );
              })()}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
            <div className="space-y-6">
              {matches.map((match, index) => (
                <div key={index} className="space-y-4 border-b pb-4 last:border-b-0">
                  <div className="p-2 bg-green-50 text-green-700 rounded">
                    Matched Rule #{match.ruleIndex + 1}
                  </div>
                  
                  <div className="space-y-2">
                    {match.matchDetails.map((detail, detailIndex) => (
                      <div key={detailIndex} className="p-2 bg-gray-50 rounded text-sm">
                        {detail}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {match.output.type && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Type</span>
                        <span className="text-gray-600">{match.output.type}</span>
                      </div>
                    )}
                    {match.output.platform && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Platform</span>
                        <span className="text-gray-600">{match.output.platform}</span>
                      </div>
                    )}
                    {match.output.channel && (
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Channel</span>
                        <span className="text-gray-600">{match.output.channel}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default UrlAnalyzer;