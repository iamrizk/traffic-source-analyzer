import { toast } from "sonner";

export interface TestCase {
  url: string;
  referralSource: string;
}

export const loadTestCases = (): TestCase[] => {
  const savedTestCases = localStorage.getItem('testCases');
  if (!savedTestCases) {
    toast.error("No test cases available", {
      description: "Please upload test cases first in the Test Cases page",
    });
    return [];
  }
  
  try {
    const testCases = JSON.parse(savedTestCases);
    // Filter out invalid test cases
    const validTestCases = testCases.filter((testCase: TestCase) => 
      testCase.url && typeof testCase.url === 'string' && 
      testCase.url.trim().length > 0
    );
    
    if (validTestCases.length === 0) {
      toast.error("No valid test cases found", {
        description: "Please ensure test cases contain valid URLs",
      });
      return [];
    }
    
    return validTestCases;
  } catch (error) {
    toast.error("Error loading test cases", {
      description: "Please ensure test cases are in the correct format",
    });
    return [];
  }
};

export const normalizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Remove any existing protocol and add https://
    const cleanUrl = url.replace(/^https?:\/\//, '');
    const urlWithProtocol = `https://${cleanUrl}`;
    const urlObj = new URL(urlWithProtocol);
    
    // Sort parameters alphabetically and ensure they're lowercase
    const params = new URLSearchParams(urlObj.search);
    const sortedParams = new URLSearchParams();
    
    // Convert all parameter values to lowercase and sort them
    Array.from(params.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .forEach(([key, value]) => {
        sortedParams.append(key, value.toLowerCase());
      });
    
    // Reconstruct URL with sorted parameters
    urlObj.search = sortedParams.toString();
    return urlObj.toString();
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url;
  }
};

export const getRandomTestCase = (testCases: TestCase[]): TestCase => {
  const randomIndex = Math.floor(Math.random() * testCases.length);
  const selectedCase = testCases[randomIndex];
  
  return {
    ...selectedCase,
    url: normalizeUrl(selectedCase.url)
  };
};