import { Rule } from "@/hooks/useRules";
import { Card } from "./ui/card";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";
import { RuleHeader } from "./rule/RuleHeader";
import { RuleContent } from "./rule/RuleContent";

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

  const handleEdit = () => {
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
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
      <RuleHeader
        index={index}
        rule={rule}
        isEditing={isEditing}
        isFirst={isFirst}
        isLast={isLast}
        onEdit={handleEdit}
        onSave={handleSave}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />

      <Accordion type="single" value={isExpanded ? "item-1" : ""} onValueChange={(value) => setIsExpanded(!!value)}>
        <AccordionItem value="item-1" className="border-none">
          <AccordionContent>
            <RuleContent
              isEditing={isEditing}
              editedRule={editedRule}
              setEditedRule={setEditedRule}
              rule={rule}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};