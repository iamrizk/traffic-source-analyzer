import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRules, Rule } from "@/hooks/useRules";
import { toast } from "sonner";
import { Plus, Download, Upload, X } from "lucide-react";
import { RuleItem } from "@/components/RuleItem";

const Settings = () => {
  const { rules, setRules, updateRule, deleteRule, moveRuleUp, moveRuleDown } = useRules();
  const [newRule, setNewRule] = useState<Rule>({
    conditions: [{ type: "parameter", parameter: "", operator: "exists" as const }],
    output: { type: "", platform: "", channel: "" },
  });

  const addCondition = () => {
    setNewRule({
      ...newRule,
      conditions: [...newRule.conditions, { type: "parameter" as const, parameter: "", operator: "exists" as const }],
    });
  };

  const removeCondition = (index: number) => {
    setNewRule({
      ...newRule,
      conditions: newRule.conditions.filter((_, i) => i !== index),
    });
  };

  const updateCondition = (conditionIndex: number, field: string, value: string) => {
    const updatedConditions = [...newRule.conditions];
    if (field === "type") {
      // Reset condition when type changes
      updatedConditions[conditionIndex] = value === "parameter"
        ? { type: "parameter", parameter: "", operator: "exists" as const }
        : { type: "referral", value: "" };
    } else {
      // Type guard to ensure type safety
      const condition = updatedConditions[conditionIndex];
      if (condition.type === "parameter" && field === "parameter") {
        condition.parameter = value;
      } else if (condition.type === "parameter" && field === "operator") {
        condition.operator = value as "exists" | "not_exists";
      } else if (condition.type === "referral" && field === "value") {
        condition.value = value;
      }
    }
    setNewRule({ ...newRule, conditions: updatedConditions });
  };

  const addRule = () => {
    setRules([...rules, newRule]);
    setNewRule({
      conditions: [{ type: "parameter" as const, parameter: "", operator: "exists" as const }],
      output: { type: "", platform: "", channel: "" },
    });
    toast.success("Rule added successfully!");
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "rules.json";

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
          setRules(importedRules);
          toast.success("Rules imported successfully!");
        } catch (error) {
          toast.error("Error importing rules");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Rules Configuration</h2>
          <div className="flex space-x-4">
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

        <div className="space-y-6">
          {/* Add New Rule Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New Rule</h3>
            {newRule.conditions.map((condition, index) => (
              <div key={index} className="flex items-end space-x-4">
                <div className="flex-1 space-y-2">
                  <Label>Condition Type</Label>
                  <Select
                    value={condition.type}
                    onValueChange={(value: "parameter" | "referral") =>
                      updateCondition(index, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parameter">Parameter</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {condition.type === "parameter" && (
                  <>
                    <div className="flex-1 space-y-2">
                      <Label>Parameter</Label>
                      <Input
                        value={condition.parameter}
                        onChange={(e) => updateCondition(index, "parameter", e.target.value)}
                        placeholder="Parameter name"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value: "exists" | "not_exists") =>
                          updateCondition(index, "operator", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exists">Exists</SelectItem>
                          <SelectItem value="not_exists">Does not exist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {condition.type === "referral" && (
                  <div className="flex-1 space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={condition.value || ""}
                      onChange={(e) => updateCondition(index, "value", e.target.value)}
                      placeholder="Referral source"
                    />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCondition(index)}
                  className="mb-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button onClick={addCondition} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Output Configuration</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Input
                  value={newRule.output.type}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      output: { ...newRule.output, type: e.target.value },
                    })
                  }
                  placeholder="e.g., Paid/Organic"
                />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Input
                  value={newRule.output.platform}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      output: { ...newRule.output, platform: e.target.value },
                    })
                  }
                  placeholder="e.g., Google/Meta"
                />
              </div>
              <div className="space-y-2">
                <Label>Channel</Label>
                <Input
                  value={newRule.output.channel}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      output: { ...newRule.output, channel: e.target.value },
                    })
                  }
                  placeholder="e.g., Instagram/MSN"
                />
              </div>
            </div>
          </div>

          <Button onClick={addRule} className="w-full">
            Save Rule
          </Button>
        </div>
      </Card>

      {rules.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Existing Rules</h3>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <RuleItem
                key={index}
                rule={rule}
                index={index}
                onUpdate={updateRule}
                onDelete={deleteRule}
                onMoveUp={moveRuleUp}
                onMoveDown={moveRuleDown}
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
