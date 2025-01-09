import { Rule } from "@/hooks/useRules";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { RuleDisplay } from "./rule/RuleDisplay";
import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm font-medium text-gray-500">Rule {index + 1}</span>
          <h4 className="text-lg font-medium">{rule.name}</h4>
        </div>
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
            onClick={() => setIsExpanded(true)}
            title="Edit Rule"
          >
            <Pencil className="h-4 w-4" />
          </Button>
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

      {isExpanded && (
        <RuleDisplay 
          rule={rule} 
          onUpdate={(updatedRule) => onUpdate(index, updatedRule)} 
        />
      )}
    </Card>
  );
};