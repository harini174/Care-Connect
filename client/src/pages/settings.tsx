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
  onNavigate: (view: string) => void;
}

export function Settings({ onBack, onNavigate }: SettingsProps) {
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

      {/* Medicine Management Link */}
      <Card className="mobile-card border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <i className="fas fa-pills text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="elderly-text font-bold text-foreground">Medicine Reminders</h3>
                <p className="text-muted-foreground font-medium">Manage your daily medicines</p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate("medicines")}
              className="elderly-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Caregiver Contact Settings */}
      <Card className="card-modern border-l-4 border-success bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="elderly-text-lg font-semibold text-foreground">Emergency Contact</h3>
            <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success font-semibold">Auto-Configured</span>
            </div>
          </div>
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
              className="elderly-button button-warning"
            >
              <i className="fas fa-paper-plane mr-3"></i>
              {isTestPending ? "Sending..." : "Send Test Alert"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Monitoring Settings */}
      <Card className="card-modern">
        <CardContent className="p-8">
          <h3 className="elderly-text-lg font-semibold text-foreground mb-6">Health Monitoring</h3>
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
      <Card className="card-modern">
        <CardContent className="p-8">
          <Button 
            onClick={handleSaveSettings}
            className="w-full elderly-button button-primary elderly-text-lg"
          >
            <i className="fas fa-save mr-3"></i>
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
