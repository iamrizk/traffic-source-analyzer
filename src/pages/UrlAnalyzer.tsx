import { useState } from "react";
import { UrlForm } from "@/components/analyzer/UrlForm";
import { AnalysisSummary } from "@/components/analyzer/AnalysisSummary";
import { AnalysisResults } from "@/components/analyzer/AnalysisResults";
import { ParametersDisplay } from "@/components/analyzer/ParametersDisplay";
import { RuleMatch } from "@/types/analyzer";
import { useRules } from "@/hooks/useRules";

const UrlAnalyzer = () => {
  const { rules } = useRules();
  const [url, setUrl] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [matches, setMatches] = useState<RuleMatch[]>([]);
  const [parameters, setParameters] = useState<Record<string, string>>({});

  const parseUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      const parameters: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        parameters[key] = value;
      });
      return parameters;
    } catch (error) {
      return {};
    }
  };

  const analyzeUrl = () => {
    const urlParameters = parseUrl(url);
    setParameters(urlParameters);
    const newMatches: RuleMatch[] = [];

    rules.forEach((rule, ruleIndex) => {
      let conditionsMet = false;
      const matchDetails: string[] = [];

      if (rule.conditions.length === 0) {
        conditionsMet = true;
      } else if (rule.conditionsOperator === "and") {
        conditionsMet = rule.conditions.every((condition) => {
          if (condition.type === "parameter") {
            const paramExists = condition.parameter in urlParameters;
            let isMatch = false;

            switch (condition.operator) {
              case "exists":
                isMatch = paramExists;
                break;
              case "not_exists":
                isMatch = !paramExists;
                break;
              case "equals":
                isMatch = paramExists && urlParameters[condition.parameter] === condition.value;
                break;
              case "not_equals":
                isMatch = paramExists && urlParameters[condition.parameter] !== condition.value;
                break;
              case "not_present":
                isMatch = !paramExists;
                break;
            }

            if (isMatch) {
              matchDetails.push(`Parameter "${condition.parameter}" ${condition.operator} ${condition.value || ''}`);
            }
            return isMatch;
          } else if (condition.type === "referral") {
            let isMatch = false;
            switch (condition.operator) {
              case "equals":
                isMatch = referralSource === condition.value;
                break;
              case "contains":
                isMatch = referralSource.includes(condition.value);
                break;
              case "not_present":
                isMatch = !referralSource;
                break;
            }
            if (isMatch) {
              matchDetails.push(`Referral ${condition.operator} ${condition.value || ''}`);
            }
            return isMatch;
          }
          return false;
        });
      } else {
        conditionsMet = rule.conditions.some((condition) => {
          if (condition.type === "parameter") {
            const paramExists = condition.parameter in urlParameters;
            let isMatch = false;

            switch (condition.operator) {
              case "exists":
                isMatch = paramExists;
                break;
              case "not_exists":
                isMatch = !paramExists;
                break;
              case "equals":
                isMatch = paramExists && urlParameters[condition.parameter] === condition.value;
                break;
              case "not_equals":
                isMatch = paramExists && urlParameters[condition.parameter] !== condition.value;
                break;
              case "not_present":
                isMatch = !paramExists;
                break;
            }

            if (isMatch) {
              matchDetails.push(`Parameter "${condition.parameter}" ${condition.operator} ${condition.value || ''}`);
            }
            return isMatch;
          } else if (condition.type === "referral") {
            let isMatch = false;
            switch (condition.operator) {
              case "equals":
                isMatch = referralSource === condition.value;
                break;
              case "contains":
                isMatch = referralSource.includes(condition.value);
                break;
              case "not_present":
                isMatch = !referralSource;
                break;
            }
            if (isMatch) {
              matchDetails.push(`Referral ${condition.operator} ${condition.value || ''}`);
            }
            return isMatch;
          }
          return false;
        });
      }

      if (conditionsMet) {
        newMatches.push({
          ruleIndex,
          matchDetails,
          output: {
            type: rule.output.trafficNature,
            platform: rule.output.platform,
            channel: rule.output.channel,
          },
        });
      }
    });

    setMatches(newMatches);
  };

  return (
    <div className="space-y-8">
      <UrlForm
        url={url}
        referralSource={referralSource}
        onUrlChange={setUrl}
        onReferralChange={setReferralSource}
        onAnalyze={analyzeUrl}
      />
      <AnalysisSummary matches={matches} />
      <ParametersDisplay parameters={parameters} />
      <AnalysisResults matches={matches} />
    </div>
  );
};

export default UrlAnalyzer;