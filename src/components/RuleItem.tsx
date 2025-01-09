import { Rule } from "@/hooks/useRules";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X } from "lucide-react";
import { useState } from "react";
import { RuleCondition } from "./rule/RuleCondition";
import { RuleOutput } from "./rule/RuleOutput";
import { RuleDisplay } from "./rule/RuleDisplay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

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

  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Rule {index + 1}</span>
          {!isEditing && rule.name && (
            <span className="text-muted-foreground">- {rule.name}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
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
          <Button variant="ghost" size="sm" onClick={() => onDelete(index)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="rule-content">
          <AccordionTrigger>
            <span className="text-sm font-medium">View Rule Details</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>

              {isEditing ? (
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
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};