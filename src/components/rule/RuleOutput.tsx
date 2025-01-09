import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface RuleOutputProps {
  type: string;
  platform: string;
  channel: string;
  onChange: (field: string, value: string) => void;
}

export const RuleOutput = ({ type, platform, channel, onChange }: RuleOutputProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label>Traffic Nature</Label>
        <Input
          value={type}
          onChange={(e) => onChange("type", e.target.value)}
        />
      </div>
      <div>
        <Label>Platform</Label>
        <Input
          value={platform}
          onChange={(e) => onChange("platform", e.target.value)}
        />
      </div>
      <div>
        <Label>Channel</Label>
        <Input
          value={channel}
          onChange={(e) => onChange("channel", e.target.value)}
        />
      </div>
    </div>
  );
};