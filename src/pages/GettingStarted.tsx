import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const GettingStarted = () => {
  const handleDownloadConfig = () => {
    // Replace YOUR_USERNAME and YOUR_REPO with your actual GitHub username and repository name
    const configUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/config/starter-config.json";
    window.open(configUrl, "_blank");
    toast.success("Starting configuration download");
  };

  const handleDownloadTestCases = (fileNumber: number) => {
    // Replace YOUR_USERNAME and YOUR_REPO with your actual GitHub username and repository name
    const testCaseUrls = [
      "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/test-cases/test-case-1.csv",
      "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/test-cases/test-case-2.csv",
      "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/test-cases/test-case-3.csv",
      "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/test-cases/test-case-4.csv"
    ];
    window.open(testCaseUrls[fileNumber - 1], "_blank");
    toast.success(`Test case #${fileNumber} download started`);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">About the App</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          This application is designed to enhance your understanding of website traffic sources 
          and improve attribution accuracy for your marketing efforts. By analyzing URL parameters 
          and patterns, it helps you better track and attribute conversions to specific advertising 
          and marketing campaigns, enabling more informed decision-making for your digital marketing 
          strategy.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">How to Use the Tool</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Start Resources</h3>
            <p className="text-gray-700 mb-4">
              Jump-start your analysis by using our sample test cases and configuration files. 
              You can download these resources below and use them as references or starting points 
              for your own analysis.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Sample Test Cases</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleDownloadTestCases(1)}>
                    <Download className="w-4 h-4 mr-2" />
                    Test Case #1
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadTestCases(2)}>
                    <Download className="w-4 h-4 mr-2" />
                    Test Case #2
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadTestCases(3)}>
                    <Download className="w-4 h-4 mr-2" />
                    Test Case #3
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadTestCases(4)}>
                    <Download className="w-4 h-4 mr-2" />
                    Test Case #4
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Configuration Template</h4>
                <Button variant="outline" onClick={handleDownloadConfig}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Starter Configuration
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Configuration Options</h3>
            <p className="text-gray-700">
              You can start with the default configuration or upload your own custom rules. 
              Visit the Settings page to customize your configuration or upload a new one that 
              better suits your needs. The test cases can be managed through the Test Cases page, 
              where you can upload and manage your URL test scenarios.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GettingStarted;