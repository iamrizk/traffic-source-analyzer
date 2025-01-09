import { Rule } from "@/hooks/useRules";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Edit, Save, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { RuleCondition } from "./rule/RuleCondition";
import { RuleOutput } from "./rule/RuleOutput";
import { RuleDisplay } from "./rule/RuleDisplay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";

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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent expanding when clicking on buttons or inputs
    if (
      e.target instanceof HTMLElement && 
      !e.target.closest('button') && 
      !e.target.closest('input') && 
      !e.target.closest('select')
    ) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card 
      className="p-4 mb-4 cursor-pointer transition-all duration-200 hover:bg-accent/50" 
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-lg">Rule {index + 1}</span>
          {!isEditing && rule.name && (
            <span className="text-muted-foreground font-medium">{rule.name}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1 mr-2">
            {!isFirst && (
              <Button variant="ghost" size="sm" onClick={() => onMoveUp(index)} className="p-1 h-9">
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
            {!isLast && (
              <Button variant="ghost" size="sm" onClick={() => onMoveDown(index)} className="p-1 h-9">
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit
              </>
            )}
          </Button>
          {isEditing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(index)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <AccordionItem value="item-1" className="border-none">
        <AccordionContent className={isExpanded ? "" : "hidden"}>
          <div className="space-y-4">
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
    </Card>
  );
};