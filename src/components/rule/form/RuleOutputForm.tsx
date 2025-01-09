import { Rule } from "@/hooks/useRules";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

interface RuleOutputFormProps {
  output: Rule["output"];
  setNewRule: (rule: Rule | ((prev: Rule) => Rule)) => void;
}

export const RuleOutputForm = ({ output, setNewRule }: RuleOutputFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Output Configuration</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Visit nature</Label>
          <Input
            value={output.type}
            onChange={(e) =>
              setNewRule((prev) => ({
                ...prev,
                output: { ...prev.output, type: e.target.value },
              }))
            }
            placeholder="e.g., Paid/Organic"
          />
        </div>
        <div className="space-y-2">
          <Label>Platform</Label>
          <Input
            value={output.platform}
            onChange={(e) =>
              setNewRule((prev) => ({
                ...prev,
                output: { ...prev.output, platform: e.target.value },
              }))
            }
            placeholder="e.g., Google/Meta"
          />
        </div>
        <div className="space-y-2">
          <Label>Channel</Label>
          <Input
            value={output.channel}
            onChange={(e) =>
              setNewRule((prev) => ({
                ...prev,
                output: { ...prev.output, channel: e.target.value },
              }))
            }
            placeholder="e.g., Instagram/MSN"
          />
        </div>
      </div>
    </div>
  );
};