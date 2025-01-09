import { Condition } from "@/hooks/useRules";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface RuleConditionProps {
  condition: Condition;
  conditionIndex: number;
  updateCondition: (conditionIndex: number, field: string, value: string) => void;
}

export const RuleCondition = ({
  condition,
  conditionIndex,
  updateCondition,
}: RuleConditionProps) => {
  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <Label>Type</Label>
        <Select
          value={condition.type}
          onValueChange={(value) => updateCondition(conditionIndex, "type", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="parameter">Parameter</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {condition.type === "parameter" && (
        <>
          <div className="flex-1">
            <Label>Parameter Name</Label>
            <Input
              value={condition.parameter}
              onChange={(e) => updateCondition(conditionIndex, "parameter", e.target.value)}
              placeholder="Parameter name"
            />
          </div>
          <div className="flex-1">
            <Label>Operator</Label>
            <Select
              value={condition.operator}
              onValueChange={(value) => updateCondition(conditionIndex, "operator", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exists">Exists</SelectItem>
                <SelectItem value="not_exists">Does not exist</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Does not equal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {["equals", "not_equals"].includes(condition.operator) && (
            <div className="flex-1">
              <Label>Parameter Value</Label>
              <Input
                value={condition.value || ""}
                onChange={(e) => updateCondition(conditionIndex, "value", e.target.value)}
                placeholder="Parameter value"
              />
            </div>
          )}
        </>
      )}

      {condition.type === "referral" && (
        <div className="flex-1">
          <Label>Value</Label>
          <Input
            value={condition.value || ""}
            onChange={(e) => updateCondition(conditionIndex, "value", e.target.value)}
            placeholder="Referral source"
          />
        </div>
      )}
    </div>
  );
};