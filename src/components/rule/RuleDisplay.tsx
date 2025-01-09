import { Rule } from "@/hooks/useRules";
import { Button } from "../ui/button";
import { useState } from "react";
import { RuleConditionsForm } from "./form/RuleConditionsForm";
import { RuleOutputForm } from "./form/RuleOutputForm";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Pencil, Save } from "lucide-react";

interface RuleDisplayProps {
  rule: Rule;
  onUpdate?: (rule: Rule) => void;
}

export const RuleDisplay = ({ rule, onUpdate }: RuleDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState<Rule>(rule);

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h5 className="font-medium">Conditions</h5>
          <div className="pl-4 space-y-1">
            {rule.conditions.map((condition, index) => (
              <div key={index} className="text-sm text-gray-600">
                {condition.type === "parameter" && (
                  <>
                    Parameter: {condition.parameter}{" "}
                    {condition.operator === "exists" && "exists"}
                    {condition.operator === "not_exists" && "does not exist"}
                    {condition.operator === "equals" && `equals ${condition.value}`}
                    {condition.operator === "not_equals" &&
                      `does not equal ${condition.value}`}
                  </>
                )}
                {condition.type === "referral" && (
                  <>
                    Referral {condition.operator} {condition.value}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium">Output</h5>
          <div className="pl-4 space-y-1 text-sm text-gray-600">
            <div>Traffic Nature: {rule.output.type}</div>
            <div>Platform: {rule.output.platform}</div>
            <div>Channel: {rule.output.channel}</div>
          </div>
        </div>

        {onUpdate && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Rule
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Rule Name</Label>
        <Input
          value={editedRule.name}
          onChange={(e) =>
            setEditedRule({ ...editedRule, name: e.target.value })
          }
          placeholder="Enter rule name"
        />
      </div>

      <RuleConditionsForm
        conditions={editedRule.conditions}
        conditionsOperator={editedRule.conditionsOperator}
        setNewRule={setEditedRule}
      />

      <RuleOutputForm output={editedRule.output} setNewRule={setEditedRule} />

      <div className="flex space-x-2">
        <Button
          onClick={() => {
            onUpdate?.(editedRule);
            setIsEditing(false);
          }}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setEditedRule(rule);
            setIsEditing(false);
          }}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};