import { Rule } from "@/hooks/useRules";
import { Button } from "../ui/button";
import { Edit, Save, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface RuleHeaderProps {
  index: number;
  rule: Rule;
  isEditing: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const RuleHeader = ({
  index,
  rule,
  isEditing,
  isFirst,
  isLast,
  onEdit,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: RuleHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <span className="font-medium text-lg">Rule {index + 1}</span>
        {!isEditing && rule.name && (
          <span className="text-muted-foreground font-medium">{rule.name}</span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isEditing ? onSave() : onEdit())}
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
    </div>
  );
};