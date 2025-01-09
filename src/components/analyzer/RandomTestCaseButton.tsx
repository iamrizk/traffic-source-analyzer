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
    const testCases = loadTestCases();
    if (testCases.length === 0) return;

    // Step 1: Clear all states and results
    onClear();

    // Step 2: Get a random test case with normalized URL
    const selectedCase = getRandomTestCase(testCases);
    
    // Step 3: Set the new input values
    onUrlChange(selectedCase.url);
    onReferralChange(selectedCase.referralSource || "");

    // Step 4: Wait for state updates to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Step 5: Trigger analysis
    onAnalyze();

    // Step 6: Show success message
    toast.success("Random test case loaded and analyzed", {
      description: "A new test case has been loaded and analyzed successfully.",
    });
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