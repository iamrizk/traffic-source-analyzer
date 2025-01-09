export interface RuleMatch {
  ruleIndex: number;
  output: {
    type: string;
    platform: string;
    channel: string;
  };
  matchDetails: string[];
}