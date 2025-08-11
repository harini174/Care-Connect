import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlertSystem } from "@/hooks/use-alert-system";
import { localStorageService, LocalSettings } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [settings, setSettings] = useState<LocalSettings>({
    caregiverName: "",
    caregiverPhone: "",
    minHeartRate: 50,
    maxHeartRate: 120,
    fallSensitivity: "medium"
  });

  const { sendTestAlert, isTestPending } = useAlertSystem();
  const { toast } = useToast();

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorageService.getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorageService.saveSettings(settings);
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
      variant: "default",
    });
  };

  const handleTestAlert = () => {
    sendTestAlert(settings.caregiverPhone);
  };

  const updateSetting = <K extends keyof LocalSettings>(key: K, value: LocalSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          aria-label="Back to Dashboard"
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </Button>
        <h2 className="elderly-text-xl font-bold text-gray-900">Settings</h2>
      </div>

      {/* Caregiver Contact Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="elderly-text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="space-y-4">
            <div>
              <Label className="block elderly-text font-medium text-gray-700 mb-2">
                Caregiver Name
              </Label>
              <Input 
                type="text" 
                className="elderly-input"
                placeholder="Enter caregiver name"
                value={settings.caregiverName}
                onChange={(e) => updateSetting("caregiverName", e.target.value)}
                aria-label="Caregiver Name"
              />
            </div>
            <div>
              <Label className="block elderly-text font-medium text-gray-700 mb-2">
                Phone Number
              </Label>
              <Input 
                type="tel" 
                className="elderly-input"
                placeholder="Enter phone number"
                value={settings.caregiverPhone}
                onChange={(e) => updateSetting("caregiverPhone", e.target.value)}
                aria-label="Caregiver Phone Number"
              />
            </div>
            <Button 
              onClick={handleTestAlert}
              disabled={isTestPending || !settings.caregiverPhone}
              className="elderly-button bg-accent hover:bg-orange-600 text-white font-semibold transition-colors"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              {isTestPending ? "Sending..." : "Send Test Alert"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Monitoring Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="elderly-text-lg font-semibold text-gray-900 mb-4">Health Monitoring</h3>
          <div className="space-y-6">
            <div>
              <Label className="block elderly-text font-medium text-gray-700 mb-2">
                Heart Rate Alert Thresholds
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Minimum (BPM)</Label>
                  <Input 
                    type="number" 
                    className="elderly-input"
                    value={settings.minHeartRate}
                    onChange={(e) => updateSetting("minHeartRate", parseInt(e.target.value) || 50)}
                    aria-label="Minimum Heart Rate Threshold"
                    min="30"
                    max="100"
                  />
                </div>
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Maximum (BPM)</Label>
                  <Input 
                    type="number" 
                    className="elderly-input"
                    value={settings.maxHeartRate}
                    onChange={(e) => updateSetting("maxHeartRate", parseInt(e.target.value) || 120)}
                    aria-label="Maximum Heart Rate Threshold"
                    min="80"
                    max="200"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="block elderly-text font-medium text-gray-700 mb-2">
                Fall Detection Sensitivity
              </Label>
              <Select 
                value={settings.fallSensitivity} 
                onValueChange={(value: "low" | "medium" | "high") => updateSetting("fallSensitivity", value)}
              >
                <SelectTrigger className="elderly-input">
                  <SelectValue aria-label="Fall Detection Sensitivity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings Button */}
      <Card>
        <CardContent className="p-6">
          <Button 
            onClick={handleSaveSettings}
            className="w-full elderly-button bg-primary hover:bg-blue-700 text-white font-semibold elderly-text-lg transition-colors"
          >
            <i className="fas fa-save mr-2"></i>
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
