import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useRules } from "@/hooks/useRules";
import { toast } from "sonner";
import { AnalysisSummary } from "@/components/analyzer/AnalysisSummary";
import { RuleMatch } from "@/types/analyzer";
import { UrlForm } from "@/components/analyzer/UrlForm";
import { ParametersDisplay } from "@/components/analyzer/ParametersDisplay";
import { AnalysisResults } from "@/components/analyzer/AnalysisResults";

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
      toast("URL analyzed successfully!", {
        description: "The URL has been successfully analyzed.",
        dismissible: true,
        duration: 5000,
      });
    } catch (error) {
      toast("Invalid URL provided", {
        description: "Please check the URL and try again.",
        dismissible: true,
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-8">
      <UrlForm
        url={url}
        referralSource={referralSource}
        onUrlChange={setUrl}
        onReferralChange={setReferralSource}
        onAnalyze={parseUrl}
      />

      {(matches.length > 0 || Object.keys(parameters).length > 0) && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
          <AnalysisSummary matches={matches} />
        </Card>
      )}

      <ParametersDisplay parameters={parameters} />

      <AnalysisResults matches={matches} />
    </div>
  );
};

export default UrlAnalyzer;