import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRules, Rule } from "@/hooks/useRules";
import { toast } from "sonner";
import { Download, Upload, Trash2 } from "lucide-react";
import { RuleItem } from "@/components/RuleItem";
import { NewRuleForm } from "@/components/rule/NewRuleForm";

const Settings = () => {
  const { rules, setRules, updateRule, deleteRule, moveRuleUp, moveRoveDown } = useRules();
  const [newRule, setNewRule] = useState<Rule>({
    name: "",
    conditions: [{ type: "parameter", parameter: "", operator: "exists" as const }],
    conditionsOperator: "and",
    output: { type: "", platform: "", channel: "" },
  });

  const addRule = () => {
    setRules([...rules, newRule]);
    setNewRule({
      name: "",
      conditions: [{ type: "parameter", parameter: "", operator: "exists" as const }],
      conditionsOperator: "and",
      output: { type: "", platform: "", channel: "" },
    });
    toast.success("Rule added successfully!");
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    // Create filename with current date and time
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const exportFileDefaultName = `trafficAnalyzerRules_${year}${month}${day}_${hours}${minutes}${seconds}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importRules = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedRules = JSON.parse(e.target?.result as string);
          // Ensure all imported rules have conditionsOperator
          const validatedRules = importedRules.map((rule: Rule) => ({
            ...rule,
            conditionsOperator: rule.conditionsOperator || "and",
          }));
          setRules(validatedRules);
          toast.success("Rules imported successfully!");
        } catch (error) {
          toast.error("Error importing rules");
        }
      };
      reader.readAsText(file);
    }
  };

  const loadStarterConfig = async () => {
    try {
      const response = await fetch('/config/starter-config.json');
      if (!response.ok) throw new Error('Failed to load starter config');
      const starterConfig = await response.json();
      setRules(starterConfig);
      toast.success("Starter configuration loaded successfully!");
    } catch (error) {
      toast.error("Error loading starter configuration");
    }
  };

  const clearAllRules = () => {
    setRules([]);
    toast.success("All rules cleared successfully!");
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Rules Configuration</h2>
          <div className="flex space-x-4">
            <Button onClick={loadStarterConfig} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Load Starter Config
            </Button>
            <Button onClick={clearAllRules} variant="outline" className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Rules
            </Button>
            <Button onClick={exportRules} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Rules
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("import-rules")?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import Rules
            </Button>
            <input
              id="import-rules"
              type="file"
              accept=".json"
              onChange={importRules}
              className="hidden"
            />
          </div>
        </div>

        <NewRuleForm
          newRule={newRule}
          setNewRule={setNewRule}
          addRule={addRule}
        />
      </Card>

      {rules.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Existing Rules ({rules.length})
          </h3>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <RuleItem
                key={index}
                rule={rule}
                index={index}
                onUpdate={updateRule}
                onDelete={deleteRule}
                onMoveUp={moveRuleUp}
                onMoveDown={moveRoveDown}
                isFirst={index === 0}
                isLast={index === rules.length - 1}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;