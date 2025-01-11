import { toast } from "sonner";
import { decompressData } from "@/components/test-cases/utils/fileHandling";

export interface TestCase {
  url: string;
  referralSource: string;
  viewed?: boolean;
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
    const testCases = decompressData(savedTestCases);
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
    console.error('Error loading test cases:', error);
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

export const getRandomTestCase = (testCases: TestCase[]): { testCase: TestCase; index: number } => {
  // First try to find unviewed test cases
  const unviewedTestCases = testCases
    .map((testCase, index) => ({ testCase, index }))
    .filter(({ testCase }) => !testCase.viewed);

  // If there are unviewed test cases, select one randomly from them
  if (unviewedTestCases.length > 0) {
    const randomIndex = Math.floor(Math.random() * unviewedTestCases.length);
    return unviewedTestCases[randomIndex];
  }

  // If all test cases have been viewed, reset all viewed flags and select randomly
  const randomIndex = Math.floor(Math.random() * testCases.length);
  const selectedCase = testCases[randomIndex];

  // Show a toast notification when starting a new cycle
  toast.info("Starting new analysis cycle", {
    description: "All test cases have been analyzed. Starting a new cycle.",
  });
  
  return {
    testCase: {
      ...selectedCase,
      url: normalizeUrl(selectedCase.url)
    },
    index: randomIndex
  };
};

export const markTestCaseAsViewed = (index: number): void => {
  try {
    const testCases = loadTestCases();
    if (testCases[index]) {
      testCases[index].viewed = true;
      localStorage.setItem('testCases', JSON.stringify(testCases));
    }
  } catch (error) {
    console.error('Error marking test case as viewed:', error);
  }
};