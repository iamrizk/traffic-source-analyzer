import { Rule } from "@/hooks/useRules";

interface RuleDisplayProps {
  rule: Rule;
}

export const RuleDisplay = ({ rule }: RuleDisplayProps) => {
  return (
    <div className="space-y-2">
      <div>
        <span className="font-medium">Conditions:</span>
        <ul className="list-disc list-inside pl-4">
          {rule.conditions.map((condition, idx) => (
            <li key={idx}>
              {condition.type === "parameter"
                ? `Parameter "${condition.parameter}" ${condition.operator}${
                    ["equals", "not_equals"].includes(condition.operator) 
                      ? ` value "${condition.value}"` 
                      : ""
                  }`
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
  );
};