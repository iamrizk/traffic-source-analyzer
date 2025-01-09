import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shuffle, X } from "lucide-react";
import { toast } from "sonner";

interface UrlFormProps {
  url: string;
  referralSource: string;
  onUrlChange: (value: string) => void;
  onReferralChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
}

export const UrlForm = ({
  url,
  referralSource,
  onUrlChange,
  onReferralChange,
  onAnalyze,
  onClear,
}: UrlFormProps) => {
  // Keep track of the last analyzed values
  let lastAnalyzedUrl = url;
  let lastAnalyzedReferral = referralSource;

  const handleRandomize = () => {
    const savedTestCases = localStorage.getItem('testCases');
    if (!savedTestCases) {
      toast("No test cases available", {
        description: "Please upload test cases first in the Test Cases page",
      });
      return;
    }

    const testCases = JSON.parse(savedTestCases);
    if (testCases.length === 0) {
      toast("No test cases available", {
        description: "Please upload test cases first in the Test Cases page",
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * testCases.length);
    const selectedCase = testCases[randomIndex];
    
    // Update both URL and referral source synchronously
    onUrlChange(selectedCase.url);
    onReferralChange(selectedCase.referralSource || "");
    
    // Update last analyzed values
    lastAnalyzedUrl = selectedCase.url;
    lastAnalyzedReferral = selectedCase.referralSource || "";
    
    // Trigger analysis immediately after state updates
    onAnalyze();
  };

  const handleAnalyze = () => {
    // Only analyze if the values have changed since last analysis
    if (url !== lastAnalyzedUrl || referralSource !== lastAnalyzedReferral) {
      lastAnalyzedUrl = url;
      lastAnalyzedReferral = referralSource;
      onAnalyze();
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">URL Analyzer</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Enter URL to analyze"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referral">Referral Source</Label>
          <Input
            id="referral"
            value={referralSource}
            onChange={(e) => onReferralChange(e.target.value)}
            placeholder="Enter referral source"
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={handleAnalyze} className="flex-1">
            Analyze URL
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRandomize}
            className="gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Random Test Case
          </Button>
          <Button
            variant="outline"
            onClick={onClear}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
};