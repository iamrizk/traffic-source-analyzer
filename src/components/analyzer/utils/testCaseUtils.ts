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

export const getRandomTestCase = (testCases: TestCase[]): TestCase => {
  const randomIndex = Math.floor(Math.random() * testCases.length);
  const selectedCase = testCases[randomIndex];
  
  // Ensure the URL is properly formatted
  if (!selectedCase.url.startsWith('http')) {
    selectedCase.url = `https://${selectedCase.url}`;
  }
  
  return selectedCase;
};