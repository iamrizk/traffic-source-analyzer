import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface UrlFormProps {
  url: string;
  referralSource: string;
  onUrlChange: (value: string) => void;
  onReferralChange: (value: string) => void;
  onAnalyze: () => void;
}

export const UrlForm = ({
  url,
  referralSource,
  onUrlChange,
  onReferralChange,
  onAnalyze,
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
        <Button onClick={onAnalyze} className="w-full">
          Analyze URL
        </Button>
      </div>
    </Card>
  );
};