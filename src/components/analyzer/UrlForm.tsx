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

interface TestCase {
  url: string;
  referralSource: string;
}

const getRandomTestCase = (testCases: TestCase[]): TestCase => {
  const randomIndex = Math.floor(Math.random() * testCases.length);
  return testCases[randomIndex];
};

const loadTestCases = (): TestCase[] => {
  const savedTestCases = localStorage.getItem('testCases');
  if (!savedTestCases) {
    toast("No test cases available", {
      description: "Please upload test cases first in the Test Cases page",
    });
    return [];
  }
  return JSON.parse(savedTestCases);
};

export const UrlForm = ({
  url,
  referralSource,
  onUrlChange,
  onReferralChange,
  onAnalyze,
  onClear,
}: UrlFormProps) => {
  const handleRandomize = () => {
    const testCases = loadTestCases();
    if (testCases.length === 0) return;

    const tryAnalysis = () => {
      // Clear everything first
      onClear();
      
      // Get a random test case
      const selectedCase = getRandomTestCase(testCases);
      
      // Update the input fields
      onUrlChange(selectedCase.url);
      onReferralChange(selectedCase.referralSource || "");
      
      // Wait for state updates to complete before analyzing
      requestAnimationFrame(() => {
        onAnalyze();
        
        // Check audit status after analysis
        requestAnimationFrame(() => {
          const auditElement = document.querySelector('[data-audit-status="failed"]');
          if (auditElement) {
            console.log("Analysis audit failed, trying another test case");
            tryAnalysis();
          } else {
            toast.success("Analysis completed successfully", {
              description: "Found a test case that passes all conditions",
            });
          }
        });
      });
    };

    tryAnalysis();
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
          <Button onClick={onAnalyze} className="flex-1">
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