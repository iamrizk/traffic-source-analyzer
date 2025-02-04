import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Database, Info } from "lucide-react";
import { toast } from "sonner";

const GettingStarted = () => {
  const handleDownloadConfig = async () => {
    try {
      const response = await fetch('/starter-config.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch configuration file: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'starter-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Starting configuration download");
    } catch (error) {
      console.error('Error downloading config:', error);
      toast.error("Failed to download configuration", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  const handleDownloadTestCases = async (fileNumber: number) => {
    try {
      const response = await fetch(`/test-case-${fileNumber}.csv`);
      if (!response.ok) {
        throw new Error(`Failed to fetch test case ${fileNumber}: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-case-${fileNumber}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Test case #${fileNumber} download started`);
    } catch (error) {
      console.error('Error downloading test case:', error);
      toast.error(`Failed to download test case ${fileNumber}`, {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-6 h-6" />
          <h2 className="text-2xl font-bold">About the Tool</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">
          This tool is designed to help you identify and analyze both paid and organic traffic sources, enabling precise attribution of conversions to specific marketing and advertising campaigns. 
          It provides comprehensive analysis of URL parameters and referral information to accurately track the effectiveness of your marketing efforts across various platforms. 
          Whether you're running paid campaigns on Google Ads, Meta Ads, or other advertising platforms, or tracking organic traffic sources, 
          this tool helps you understand which channels and campaigns are driving your conversions.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">AI-Powered Analysis</h3>
          <p className="text-sm text-blue-700">
            The narrative generation in the analysis section is powered by Google's Gemini 2.0 Flash model through OpenRouter.ai. 
            You can create a free API key at OpenRouter.ai to access this feature. The model provides detailed insights about your traffic sources 
            and helps interpret the analysis results in natural language.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">How to Use the Tool</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Quick Start Resources</h3>
            <p className="text-gray-700 mb-4">
              Get started with our sample test cases that demonstrate various URL structures from different advertising platforms. 
              The configuration file contains rules for identifying traffic sources based on URL parameters and referral information.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Sample Test Cases</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => handleDownloadTestCases(1)}>
                    <Database className="w-4 h-4 mr-2" />
                    Test Case #1
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadTestCases(2)}>
                    <Database className="w-4 h-4 mr-2" />
                    Test Case #2
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadTestCases(3)}>
                    <Database className="w-4 h-4 mr-2" />
                    Test Case #3
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadTestCases(4)}>
                    <Database className="w-4 h-4 mr-2" />
                    Test Case #4
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Configuration Template</h4>
                <Button variant="outline" onClick={handleDownloadConfig}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download Starter Configuration
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Configuration Options</h3>
            <p className="text-gray-700">
              Start with the provided configuration file that includes rules for identifying traffic from major advertising platforms 
              like Google Ads, Meta Ads, and Microsoft Ads. You can customize these rules or add new ones through the Settings page. 
              Test your configuration using the sample test cases or upload your own through the Test Cases page.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GettingStarted;