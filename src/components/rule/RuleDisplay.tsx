import { Rule } from "@/hooks/useRules";

interface RuleDisplayProps {
  rule: Rule;
}

export const RuleDisplay = ({ rule }: RuleDisplayProps) => {
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
    </div>
  );
};