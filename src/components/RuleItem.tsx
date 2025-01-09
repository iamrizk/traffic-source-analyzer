import { Rule } from "@/hooks/useRules";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { RuleDisplay } from "./rule/RuleDisplay";

interface RuleItemProps {
  rule: Rule;
  index: number;
  onUpdate: (index: number, rule: Rule) => void;
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
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-medium">{rule.name}</h4>
        <div className="flex space-x-2">
          {!isFirst && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onMoveUp(index)}
              title="Move Up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
          {!isLast && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onMoveDown(index)}
              title="Move Down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(index)}
            className="text-red-500 hover:text-red-600"
            title="Delete Rule"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <RuleDisplay rule={rule} />
    </Card>
  );
};