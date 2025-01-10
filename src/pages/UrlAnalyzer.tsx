import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useRules } from "@/hooks/useRules";
import { toast } from "sonner";
import { AnalysisSummary } from "@/components/analyzer/AnalysisSummary";
import { RuleMatch } from "@/types/analyzer";
import { UrlForm } from "@/components/analyzer/UrlForm";
import { ParametersDisplay } from "@/components/analyzer/ParametersDisplay";
import { AnalysisResults } from "@/components/analyzer/AnalysisResults";
import { ParametersAudit } from "@/components/analyzer/ParametersAudit";
import { ConsolidatedSummary } from "@/components/analyzer/ConsolidatedSummary";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import AnalysisPDF from "@/components/analyzer/AnalysisPDF";

const UrlAnalyzer = () => {
  const [url, setUrl] = useState(() => localStorage.getItem("analyzer_url") || "");
  const [referralSource, setReferralSource] = useState(() => localStorage.getItem("analyzer_referral") || "");
  const [parameters, setParameters] = useState<Record<string, string>>(() => {
    const savedParams = localStorage.getItem("analyzer_parameters");
    return savedParams ? JSON.parse(savedParams) : {};
  });
  const [matches, setMatches] = useState<RuleMatch[]>(() => {
    const savedMatches = localStorage.getItem("analyzer_matches");
    return savedMatches ? JSON.parse(savedMatches) : [];
  });

  const { rules } = useRules();

  useEffect(() => {
    localStorage.setItem("analyzer_url", url);
    localStorage.setItem("analyzer_referral", referralSource);
    localStorage.setItem("analyzer_parameters", JSON.stringify(parameters));
    localStorage.setItem("analyzer_matches", JSON.stringify(matches));
  }, [url, referralSource, parameters, matches]);

  const handleClear = () => {
    setUrl("");
    setReferralSource("");
    setParameters({});
    setMatches([]);
    localStorage.removeItem("analyzer_url");
    localStorage.removeItem("analyzer_referral");
    localStorage.removeItem("analyzer_parameters");
    localStorage.removeItem("analyzer_matches");
    toast("All fields cleared", {
      description: "The analyzer has been reset.",
    });
  };

  const parseUrl = () => {
    setParameters({});
    setMatches([]);
    
    try {
      let urlToParse = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlToParse = `https://${url}`;
      }

      const urlObj = new URL(urlToParse);
      const params: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value.toLowerCase();
      });
      setParameters(params);

      const newMatches: RuleMatch[] = [];
      const lowerCaseReferral = referralSource.toLowerCase();

      rules.forEach((rule, ruleIndex) => {
        const matchDetails: string[] = [];
        let conditionsMet = 0;

        for (const condition of rule.conditions) {
          if (condition.type === "parameter") {
            const paramExists = condition.parameter in params;
            const paramValue = params[condition.parameter];
            const conditionValue = condition.value?.toLowerCase();

            if (condition.operator === "exists" && paramExists) {
              matchDetails.push(`Parameter '${condition.parameter}' exists as required`);
              conditionsMet++;
            } else if (condition.operator === "not_exists" && !paramExists) {
              matchDetails.push(`Parameter '${condition.parameter}' does not exist as required`);
              conditionsMet++;
            } else if (condition.operator === "not_present" && !paramExists) {
              matchDetails.push(`Parameter '${condition.parameter}' is not present as required`);
              conditionsMet++;
            } else if (condition.operator === "equals" && paramValue === conditionValue) {
              matchDetails.push(`Parameter '${condition.parameter}' value matches '${condition.value}'`);
              conditionsMet++;
            } else if (condition.operator === "not_equals" && paramValue !== conditionValue) {
              matchDetails.push(`Parameter '${condition.parameter}' value does not match '${condition.value}'`);
              conditionsMet++;
            } else {
              matchDetails.push(
                `Parameter '${condition.parameter}' condition not met (${condition.operator})`
              );
            }
          } else if (condition.type === "referral") {
            const conditionValue = condition.value?.toLowerCase();
            
            if (condition.operator === "not_present" && !lowerCaseReferral) {
              matchDetails.push(`Referral source is not present as required`);
              conditionsMet++;
            } else if (
              (condition.operator === "equals" && lowerCaseReferral === conditionValue) ||
              (condition.operator === "contains" && lowerCaseReferral.includes(conditionValue || ''))
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
            ruleName: rule.name,
            output: rule.output,
            matchDetails,
            conditions: rule.conditions
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

  const handlePrintReport = async () => {
    if (!url) {
      toast.error("No URL provided", {
        description: "Please enter a URL before generating a report.",
      });
      return;
    }

    try {
      const blob = await pdf(
        <AnalysisPDF
          url={url}
          referralSource={referralSource}
          matches={matches}
          parameters={parameters}
        />
      ).toBlob();
      
      const pdfUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `url-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);

      toast.success("Report generated", {
        description: "Your analysis report has been downloaded.",
      });
    } catch (error) {
      toast.error("Failed to generate report", {
        description: "An error occurred while generating the PDF report.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <UrlForm
          url={url}
          referralSource={referralSource}
          onUrlChange={setUrl}
          onReferralChange={setReferralSource}
          onAnalyze={parseUrl}
          onClear={handleClear}
        />
        <Button
          onClick={handlePrintReport}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Printer className="w-4 h-4" />
          Print Report
        </Button>
      </div>

      <ConsolidatedSummary matches={matches} />

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
        <AnalysisSummary matches={matches} />
      </Card>

      <AnalysisResults matches={matches} />

      <ParametersDisplay parameters={parameters} matches={matches} />

      <ParametersAudit url={url} parameters={parameters} />
    </div>
  );
};

export default UrlAnalyzer;
