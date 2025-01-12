import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getRandomTestCase, loadTestCases, markTestCaseAsViewed } from "./utils/testCaseUtils";

export const RandomTestCaseButton = () => {
  const navigate = useNavigate();

  const handleRandomTestCase = () => {
    const testCases = loadTestCases();
    if (testCases.length === 0) return;

    const { testCase, index } = getRandomTestCase(testCases);
    
    localStorage.setItem("analyzer_url", testCase.url);
    localStorage.setItem("analyzer_referral", testCase.referralSource || "");
    
    // Mark the test case as viewed
    markTestCaseAsViewed(index);
    
    navigate("/");
    toast.success("Random test case loaded", {
      description: "A random test case has been loaded into the analyzer.",
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={handleRandomTestCase}
    >
      <Shuffle className="w-4 h-4 mr-2" />
      Random Test Case
    </Button>
  );
};