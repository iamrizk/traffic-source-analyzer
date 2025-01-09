import { useState, useEffect } from "react";

interface Condition {
  type: "parameter" | "referral";
  parameter?: string;
  operator?: "exists" | "not_exists";
  value?: string;
}

interface Rule {
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

  return { rules, setRules };
}