import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { toast } from "sonner";
import { loadTestCases, getRandomTestCase } from "./utils/testCaseUtils";

interface RandomTestCaseButtonProps {
  onUrlChange: (value: string) => void;
  onReferralChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
}

export const RandomTestCaseButton = ({
  onUrlChange,
  onReferralChange,
  onAnalyze,
  onClear,
}: RandomTestCaseButtonProps) => {
  const handleRandomize = async () => {
    try {
      const testCases = loadTestCases();
      if (testCases.length === 0) {
        toast.error("No test cases available", {
          description: "Please upload test cases first in the Test Cases page.",
        });
        return;
      }

      // Step 1: Clear all states and results
      onClear();

      // Step 2: Get a random test case
      const { testCase: selectedCase, index: randomIndex } = getRandomTestCase(testCases);
      const serialNumber = randomIndex + 1; // Serial numbers start from 1

      // Step 3: Set URL
      onUrlChange(selectedCase.url);

      // Step 4: Set referral source
      onReferralChange(selectedCase.referralSource || "");

      // Step 5: Show success message with serial number
      toast.success("Random test case loaded", {
        description: `Test case #${serialNumber} has been loaded. Click 'Analyze URL' to process it.`,
      });
    } catch (error) {
      console.error('Error in handleRandomize:', error);
      toast.error("Failed to load random test case", {
        description: "An error occurred while loading the test case.",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleRandomize}
      className="gap-2"
    >
      <Shuffle className="w-4 h-4" />
      Random Test Case
    </Button>
  );
};