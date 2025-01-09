import { Rule } from "@/hooks/useRules";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";
import { RuleConditionsForm } from "./form/RuleConditionsForm";
import { RuleOutputForm } from "./form/RuleOutputForm";

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Add New Rule</h3>

      <div className="space-y-2">
        <Label>Rule Name</Label>
        <Input
          value={newRule.name}
          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
          placeholder="Enter rule name"
        />
      </div>

      <RuleConditionsForm
        conditions={newRule.conditions}
        conditionsOperator={newRule.conditionsOperator}
        setNewRule={setNewRule}
      />

      <Button onClick={addCondition} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Condition
      </Button>

      <RuleOutputForm
        output={newRule.output}
        setNewRule={setNewRule}
      />

      <Button onClick={addRule} className="w-full">
        Save Rule
      </Button>
    </div>
  );
};