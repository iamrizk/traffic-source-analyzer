import { Rule } from "@/hooks/useRules";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";
import { useState } from "react";

interface RuleItemProps {
  rule: Rule;
  index: number;
  onUpdate: (index: number, updatedRule: Rule) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const RuleItem = ({
  rule,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: RuleItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState<Rule>(rule);

  const handleSave = () => {
    onUpdate(index, editedRule);
    setIsEditing(false);
  };

  const updateCondition = (conditionIndex: number, field: string, value: string) => {
    const updatedConditions = [...editedRule.conditions];
    if (field === "type") {
      // Reset condition when type changes
      updatedConditions[conditionIndex] = value === "parameter"
        ? { type: "parameter", parameter: "", operator: "exists" as const }
        : { type: "referral", value: "" };
    } else {
      // Type guard to ensure type safety
      const condition = updatedConditions[conditionIndex];
      if (condition.type === "parameter" && field === "parameter") {
        condition.parameter = value;
      } else if (condition.type === "parameter" && field === "operator") {
        condition.operator = value as "exists" | "not_exists";
      } else if (condition.type === "referral" && field === "value") {
        condition.value = value;
      }
    }
    setEditedRule({ ...editedRule, conditions: updatedConditions });
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Rule {index + 1}</span>
          {!isFirst && (
            <Button variant="outline" size="sm" onClick={() => onMoveUp(index)}>
              ↑
            </Button>
          )}
          {!isLast && (
            <Button variant="outline" size="sm" onClick={() => onMoveDown(index)}>
              ↓
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(index)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-4">
            {editedRule.conditions.map((condition, condIndex) => (
              <div key={condIndex} className="flex space-x-4">
                <div className="flex-1">
                  <Label>Type</Label>
                  <Select
                    value={condition.type}
                    onValueChange={(value) => updateCondition(condIndex, "type", value)}
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
                      <Label>Parameter</Label>
                      <Input
                        value={condition.parameter}
                        onChange={(e) => updateCondition(condIndex, "parameter", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(condIndex, "operator", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exists">Exists</SelectItem>
                          <SelectItem value="not_exists">Does not exist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {condition.type === "referral" && (
                  <div className="flex-1">
                    <Label>Value</Label>
                    <Input
                      value={condition.value || ""}
                      onChange={(e) => updateCondition(condIndex, "value", e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Type</Label>
              <Input
                value={editedRule.output.type}
                onChange={(e) =>
                  setEditedRule({
                    ...editedRule,
                    output: { ...editedRule.output, type: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Platform</Label>
              <Input
                value={editedRule.output.platform}
                onChange={(e) =>
                  setEditedRule({
                    ...editedRule,
                    output: { ...editedRule.output, platform: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Channel</Label>
              <Input
                value={editedRule.output.channel}
                onChange={(e) =>
                  setEditedRule({
                    ...editedRule,
                    output: { ...editedRule.output, channel: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="font-medium">Conditions:</span>
            <ul className="list-disc list-inside pl-4">
              {rule.conditions.map((condition, idx) => (
                <li key={idx}>
                  {condition.type === "parameter"
                    ? `Parameter "${condition.parameter}" ${condition.operator}`
                    : `Referral source is "${condition.value}"`}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-medium">Output:</span>
            <div className="pl-4">
              <div>Type: {rule.output.type}</div>
              <div>Platform: {rule.output.platform}</div>
              <div>Channel: {rule.output.channel}</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
