import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RuleMatch } from "@/types/analyzer";

export const useUrlAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [matches, setMatches] = useState<RuleMatch[]>([]);
  const [parameters, setParameters] = useState<Record<string, string>>({});

  const parseUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      const parameters: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        parameters[key] = value;
      });
      return parameters;
    } catch (error) {
      return {};
    }
  };

  return {
    url,
    setUrl,
    referralSource,
    setReferralSource,
    matches,
    setMatches,
    parameters,
    setParameters,
    parseUrl,
  };
};