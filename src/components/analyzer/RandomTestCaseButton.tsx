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
  const handleRandomize = () => {
    const testCases = loadTestCases();
    if (testCases.length === 0) return;

    let attempts = 0;
    const maxAttempts = 10;

    const tryAnalysis = () => {
      if (attempts >= maxAttempts) {
        toast.error("Could not find a passing test case", {
          description: "Tried 10 different test cases without success",
        });
        return;
      }

      attempts++;
      
      // Clear previous state
      onClear();
      
      // Get a random test case
      const selectedCase = getRandomTestCase(testCases);
      
      // Update the input fields
      onUrlChange(selectedCase.url);
      onReferralChange(selectedCase.referralSource || "");
      
      // Analyze after a short delay to ensure state updates
      setTimeout(() => {
        onAnalyze();
        
        // Check audit status
        setTimeout(() => {
          const auditElement = document.querySelector('[data-audit-status="failed"]');
          if (auditElement && attempts < maxAttempts) {
            console.log(`Analysis audit failed, attempt ${attempts} of ${maxAttempts}`);
            tryAnalysis();
          } else if (!auditElement) {
            toast.success("Analysis completed successfully", {
              description: "Found a test case that passes all conditions",
            });
          }
        }, 100);
      }, 100);
    };

    tryAnalysis();
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