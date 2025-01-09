import { Condition } from "@/hooks/useRules";

export interface RuleMatch {
  ruleIndex: number;
  ruleName: string;
  output: {
    type: string;
    platform: string;
    channel: string;
  };
  matchDetails: string[];
  conditions: Condition[];
}