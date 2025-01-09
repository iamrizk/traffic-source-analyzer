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

      // Step 3: Set URL first
      onUrlChange(selectedCase.url);

      // Step 4: Set referral source
      onReferralChange(selectedCase.referralSource || "");

      // Step 5: Use requestAnimationFrame to ensure state updates are processed
      requestAnimationFrame(() => {
        // Step 6: First analysis run
        onAnalyze();

        // Step 7: Second analysis run after a short delay to ensure states are updated
        setTimeout(() => {
          onAnalyze();
          
          // Step 8: Show success message after both analyses are complete
          toast.success("Random test case loaded and analyzed", {
            description: "A new test case has been loaded and analyzed successfully.",
          });
        }, 100);
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