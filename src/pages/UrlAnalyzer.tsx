import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRules } from "@/hooks/useRules";
import { toast } from "sonner";
import { PageHeader } from "@/components/analyzer/PageHeader";
import { Footer } from "@/components/analyzer/Footer";
import { AnalysisSummary } from "@/components/analyzer/AnalysisSummary";
import { RuleMatch } from "@/types/analyzer";

const UrlAnalyzer = () => {
  const [url, setUrl] = useState(() => localStorage.getItem("analyzer_url") || "");
  const [referralSource, setReferralSource] = useState(() => localStorage.getItem("analyzer_referral") || "");
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [matches, setMatches] = useState<RuleMatch[]>([]);

  const { rules } = useRules();

  useEffect(() => {
    localStorage.setItem("analyzer_url", url);
    localStorage.setItem("analyzer_referral", referralSource);
  }, [url, referralSource]);

  const parseUrl = () => {
    try {
      // Add protocol if missing
      let urlToParse = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlToParse = `https://${url}`;
      }

      const urlObj = new URL(urlToParse);
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
            } else if (condition.operator === "not_present" && !paramExists) {
              matchDetails.push(`Parameter '${condition.parameter}' is not present as required`);
              conditionsMet++;
            } else if (condition.operator === "equals" && paramValue === condition.value) {
              matchDetails.push(`Parameter '${condition.parameter}' value matches '${condition.value}'`);
              conditionsMet++;
            } else if (condition.operator === "not_equals" && paramValue !== condition.value) {
              matchDetails.push(`Parameter '${condition.parameter}' value does not match '${condition.value}'`);
              conditionsMet++;
            } else {
              matchDetails.push(
                `Parameter '${condition.parameter}' condition not met (${condition.operator})`
              );
            }
          } else if (condition.type === "referral") {
            if (condition.operator === "not_present" && !referralSource) {
              matchDetails.push(`Referral source is not present as required`);
              conditionsMet++;
            } else if (
              (condition.operator === "equals" && referralSource === condition.value) ||
              (condition.operator === "contains" && referralSource.includes(condition.value))
            ) {
              matchDetails.push(`Referral source matches '${condition.value}'`);
              conditionsMet++;
            } else {
              matchDetails.push(`Referral source condition not met (${condition.operator})`);
            }
          }
        }

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
      toast.success("URL analyzed successfully!", {
        dismissible: true
      });
    } catch (error) {
      toast.error("Invalid URL provided", {
        dismissible: true
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader />
      
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
            <AnalysisSummary matches={matches} />
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
                        <span className="font-medium">Visit nature</span>
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

      {matches.length === 0 && parameters && Object.keys(parameters).length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
          <AnalysisSummary matches={matches} />
        </Card>
      )}

      <Footer />
    </div>
  );
};

export default UrlAnalyzer;