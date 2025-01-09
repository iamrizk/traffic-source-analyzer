import { useState, useEffect } from "react";

interface BaseCondition {
  type: "parameter" | "referral";
}

interface ParameterCondition extends BaseCondition {
  type: "parameter";
  parameter: string;
  operator: "exists" | "not_exists" | "equals" | "not_equals";
  value?: string;
}

interface ReferralCondition extends BaseCondition {
  type: "referral";
  value: string;
  operator: "equals" | "contains";
}

export type Condition = ParameterCondition | ReferralCondition;

export interface Rule {
  conditions: Condition[];
  output: {
    type: string;
    platform: string;
    channel: string;
  };
}

export function useRules() {
  const [rules, setRules] = useState<Rule[]>(() => {
    const savedRules = localStorage.getItem("url-analyzer-rules");
    return savedRules ? JSON.parse(savedRules) : [];
  });

  useEffect(() => {
    localStorage.setItem("url-analyzer-rules", JSON.stringify(rules));
  }, [rules]);

  const updateRule = (index: number, updatedRule: Rule) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    setRules(newRules);
  };

  const deleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const moveRuleUp = (index: number) => {
    if (index > 0) {
      const newRules = [...rules];
      [newRules[index - 1], newRules[index]] = [newRules[index], newRules[index - 1]];
      setRules(newRules);
    }
  };

  const moveRuleDown = (index: number) => {
    if (index < rules.length - 1) {
      const newRules = [...rules];
      [newRules[index], newRules[index + 1]] = [newRules[index + 1], newRules[index]];
      setRules(newRules);
    }
  };

  return { rules, setRules, updateRule, deleteRule, moveRuleUp, moveRuleDown };
}