import { toast } from "sonner";

export interface TestCase {
  url: string;
  referralSource: string;
}

export const loadTestCases = (): TestCase[] => {
  const savedTestCases = localStorage.getItem('testCases');
  if (!savedTestCases) {
    toast("No test cases available", {
      description: "Please upload test cases first in the Test Cases page",
    });
    return [];
  }
  return JSON.parse(savedTestCases);
};

export const getRandomTestCase = (testCases: TestCase[]): TestCase => {
  const randomIndex = Math.floor(Math.random() * testCases.length);
  return testCases[randomIndex];
};