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
      if (testCases.length === 0) return;

      // Step 1: Clear all states and results
      onClear();

      // Step 2: Get a random test case with normalized URL
      const selectedCase = getRandomTestCase(testCases);

      // Step 3: Set URL first and wait for it to complete
      await new Promise<void>(resolve => {
        onUrlChange(selectedCase.url);
        setTimeout(resolve, 50); // Small delay to ensure state update
      });

      // Step 4: Set referral source and wait for it to complete
      await new Promise<void>(resolve => {
        onReferralChange(selectedCase.referralSource || "");
        setTimeout(resolve, 50); // Small delay to ensure state update
      });

      // Step 5: Final delay to ensure React has processed all updates
      await new Promise(resolve => setTimeout(resolve, 50));

      // Step 6: Trigger analysis
      onAnalyze();

      // Step 7: Show success message
      toast.success("Random test case loaded and analyzed", {
        description: "A new test case has been loaded and analyzed successfully.",
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