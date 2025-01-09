import { Rule } from "@/hooks/useRules";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface NewRuleFormProps {
  newRule: Rule;
  setNewRule: (rule: Rule) => void;
  addRule: () => void;
}

export const NewRuleForm = ({ newRule, setNewRule, addRule }: NewRuleFormProps) => {
  const addCondition = () => {
    setNewRule({
      ...newRule,
      conditions: [...newRule.conditions, { type: "parameter" as const, parameter: "", operator: "exists" as const }],
    });
  };

  const removeCondition = (index: number) => {
    setNewRule({
      ...newRule,
      conditions: newRule.conditions.filter((_, i) => i !== index),
    });
  };

  const updateCondition = (conditionIndex: number, field: string, value: string) => {
    const updatedConditions = [...newRule.conditions];
    if (field === "type") {
      if (value === "no_parameter") {
        updatedConditions[conditionIndex] = { type: "parameter", parameter: "", operator: "not_present" as const };
      } else if (value === "no_referral") {
        updatedConditions[conditionIndex] = { type: "referral", value: "", operator: "not_present" as const };
      } else {
        updatedConditions[conditionIndex] = value === "parameter"
          ? { type: "parameter", parameter: "", operator: "exists" as const }
          : { type: "referral", value: "", operator: "equals" as const };
      }
    } else {
      const condition = updatedConditions[conditionIndex];
      if (condition.type === "parameter") {
        if (field === "parameter") {
          condition.parameter = value;
        } else if (field === "operator") {
          condition.operator = value as "exists" | "not_exists" | "equals" | "not_equals" | "not_present";
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
          condition.operator = value as "equals" | "contains" | "not_present";
        }
      }
    }
    setNewRule({ ...newRule, conditions: updatedConditions });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Add New Rule</h3>

      <div className="space-y-2">
        <Label>Conditions Operator</Label>
        <Select
          value={newRule.conditionsOperator}
          onValueChange={(value: "and" | "or") =>
            setNewRule({ ...newRule, conditionsOperator: value })
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

      {newRule.conditions.map((condition, index) => (
        <div key={index} className="flex items-end space-x-4">
          <div className="flex-1 space-y-2">
            <Label>Condition Type</Label>
            <Select
              value={
                condition.operator === "not_present"
                  ? condition.type === "parameter"
                    ? "no_parameter"
                    : "no_referral"
                  : condition.type
              }
              onValueChange={(value) => updateCondition(index, "type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parameter">Parameter</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="no_parameter">No Parameters</SelectItem>
                <SelectItem value="no_referral">No Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {condition.type === "parameter" && condition.operator !== "not_present" && (
            <>
              <div className="flex-1 space-y-2">
                <Label>Parameter Name</Label>
                <Input
                  value={condition.parameter}
                  onChange={(e) => updateCondition(index, "parameter", e.target.value)}
                  placeholder="Parameter name"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, "operator", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
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
                <div className="flex-1 space-y-2">
                  <Label>Parameter Value</Label>
                  <Input
                    value={condition.value || ""}
                    onChange={(e) => updateCondition(index, "value", e.target.value)}
                    placeholder="Parameter value"
                  />
                </div>
              )}
            </>
          )}

          {condition.type === "referral" && condition.operator !== "not_present" && (
            <>
              <div className="flex-1 space-y-2">
                <Label>Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, "operator", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>Value</Label>
                <Input
                  value={condition.value || ""}
                  onChange={(e) => updateCondition(index, "value", e.target.value)}
                  placeholder="Referral source"
                />
              </div>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeCondition(index)}
            className="mb-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button onClick={addCondition} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Condition
      </Button>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Output Configuration</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Visit nature</Label>
            <Input
              value={newRule.output.type}
              onChange={(e) =>
                setNewRule({
                  ...newRule,
                  output: { ...newRule.output, type: e.target.value },
                })
              }
              placeholder="e.g., Paid/Organic"
            />
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <Input
              value={newRule.output.platform}
              onChange={(e) =>
                setNewRule({
                  ...newRule,
                  output: { ...newRule.output, platform: e.target.value },
                })
              }
              placeholder="e.g., Google/Meta"
            />
          </div>
          <div className="space-y-2">
            <Label>Channel</Label>
            <Input
              value={newRule.output.channel}
              onChange={(e) =>
                setNewRule({
                  ...newRule,
                  output: { ...newRule.output, channel: e.target.value },
                })
              }
              placeholder="e.g., Instagram/MSN"
            />
          </div>
        </div>
      </div>

      <Button onClick={addRule} className="w-full">
        Save Rule
      </Button>
    </div>
  );
};