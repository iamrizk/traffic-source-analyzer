import { Rule } from "@/hooks/useRules";
import { RuleCondition } from "./RuleCondition";
import { RuleOutput } from "./RuleOutput";
import { RuleDisplay } from "./RuleDisplay";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface RuleContentProps {
  isEditing: boolean;
  editedRule: Rule;
  setEditedRule: (rule: Rule) => void;
  rule: Rule;
}

export const RuleContent = ({ isEditing, editedRule, setEditedRule, rule }: RuleContentProps) => {
  const updateCondition = (conditionIndex: number, field: string, value: string) => {
    const updatedConditions = [...editedRule.conditions];
    if (field === "type") {
      updatedConditions[conditionIndex] = value === "parameter"
        ? { type: "parameter", parameter: "", operator: "exists" as const }
        : { type: "referral", value: "", operator: "equals" as const };
    } else {
      const condition = updatedConditions[conditionIndex];
      if (condition.type === "parameter") {
        if (field === "parameter") {
          condition.parameter = value;
        } else if (field === "operator") {
          condition.operator = value as "exists" | "not_exists" | "equals" | "not_equals";
          if (["equals", "not_equals"].includes(value)) {
            condition.value = condition.value || "";
          } else {
            delete condition.value;
          }
        } else if (field === "value") {
          condition.value = value;
        }
      } else if (condition.type === "referral") {
        if (field === "value") {
          condition.value = value;
        } else if (field === "operator") {
          condition.operator = value as "equals" | "contains";
        }
      }
    }
    setEditedRule({ ...editedRule, conditions: updatedConditions });
  };

  const updateOutput = (field: string, value: string) => {
    setEditedRule({
      ...editedRule,
      output: { ...editedRule.output, [field]: value },
    });
  };

  return isEditing ? (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Rule Name</Label>
        <Input
          value={editedRule.name}
          onChange={(e) => setEditedRule({ ...editedRule, name: e.target.value })}
          placeholder="Enter rule name"
        />
      </div>

      <div className="space-y-2">
        <Label>Conditions Operator</Label>
        <Select
          value={editedRule.conditionsOperator}
          onValueChange={(value: "and" | "or") =>
            setEditedRule({ ...editedRule, conditionsOperator: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="and">AND</SelectItem>
            <SelectItem value="or">OR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {editedRule.conditions.map((condition, condIndex) => (
          <RuleCondition
            key={condIndex}
            condition={condition}
            conditionIndex={condIndex}
            updateCondition={updateCondition}
          />
        ))}
      </div>

      <RuleOutput
        type={editedRule.output.type}
        platform={editedRule.output.platform}
        channel={editedRule.output.channel}
        onChange={updateOutput}
      />
    </div>
  ) : (
    <RuleDisplay rule={rule} />
  );
};