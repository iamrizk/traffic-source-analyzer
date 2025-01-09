import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { RandomTestCaseButton } from "./RandomTestCaseButton";

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
          <RandomTestCaseButton
            onUrlChange={onUrlChange}
            onReferralChange={onReferralChange}
            onAnalyze={onAnalyze}
            onClear={onClear}
          />
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