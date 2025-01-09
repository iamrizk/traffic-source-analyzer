import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRules } from "@/hooks/useRules";
import { toast } from "sonner";

const UrlAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<{
    type?: string;
    platform?: string;
    channel?: string;
  }>();

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
      for (const rule of rules) {
        let conditionMet = true;
        for (const condition of rule.conditions) {
          if (condition.type === "parameter") {
            const paramExists = condition.parameter in params;
            if (condition.operator === "exists" && !paramExists) {
              conditionMet = false;
              break;
            }
            if (condition.operator === "not_exists" && paramExists) {
              conditionMet = false;
              break;
            }
          } else if (condition.type === "referral") {
            if (condition.value !== referralSource) {
              conditionMet = false;
              break;
            }
          }
        }

        if (conditionMet) {
          setAnalysis(rule.output);
          return;
        }
      }

      setAnalysis(undefined);
      toast.success("URL analyzed successfully!");
    } catch (error) {
      toast.error("Invalid URL provided");
    }
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

      {analysis && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          <div className="space-y-2">
            {analysis.type && (
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">Type</span>
                <span className="text-gray-600">{analysis.type}</span>
              </div>
            )}
            {analysis.platform && (
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">Platform</span>
                <span className="text-gray-600">{analysis.platform}</span>
              </div>
            )}
            {analysis.channel && (
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">Channel</span>
                <span className="text-gray-600">{analysis.channel}</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default UrlAnalyzer;