import { useHealthData } from "@/hooks/use-health-data";
import { useAlertSystem } from "@/hooks/use-alert-system";
import { EmergencyButton } from "@/components/emergency-button";
import { HealthCard } from "@/components/health-card";
import { Card, CardContent } from "@/components/ui/card";
import { localStorageService } from "@/lib/storage";
import { useEffect } from "react";

export function Dashboard() {
  const { healthData, isLoading } = useHealthData();
  const { checkHeartRateAlert } = useAlertSystem();

  // Check for heart rate alerts whenever heart rate changes
  useEffect(() => {
    if (!healthData) return;

    const settings = localStorageService.getSettings();
    if (settings) {
      checkHeartRateAlert(
        healthData.heartRate,
        settings.minHeartRate,
        settings.maxHeartRate
      );
    }
  }, [healthData?.heartRate, checkHeartRateAlert]);

  if (isLoading || !healthData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
          <div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const getHeartRateStatus = (heartRate: number) => {
    const settings = localStorageService.getSettings();
    const minRate = settings?.minHeartRate || 50;
    const maxRate = settings?.maxHeartRate || 120;

    if (heartRate < minRate || heartRate > maxRate) {
      return "error";
    }
    return "normal";
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString();
  };

  const todaysAlerts = localStorageService.getAlerts().filter(alert => {
    const today = new Date();
    const alertDate = new Date(alert.timestamp);
    return alertDate.toDateString() === today.toDateString();
  });

  const avgHeartRate = todaysAlerts
    .filter(alert => alert.heartRate)
    .reduce((sum, alert, _, arr) => sum + (alert.heartRate || 0) / arr.length, 0);

  const fallsDetected = todaysAlerts.filter(alert => alert.type === "fall_detection").length;

  return (
    <div className="space-y-6">
      {/* Emergency SOS Button */}
      <EmergencyButton />

      {/* Real-time Health Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Monitoring Card */}
        <HealthCard
          title="Heart Rate"
          value={healthData.heartRate}
          unit="BPM"
          status={getHeartRateStatus(healthData.heartRate)}
          icon="fas fa-heartbeat"
          subtitle="Normal Range"
          lastUpdate={formatLastUpdate(healthData.lastUpdate)}
          isLive={true}
        />

        {/* Fall Detection Card */}
        <Card className="border-l-4 border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="elderly-text-lg font-semibold text-gray-900">Fall Detection</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">Active</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-3xl text-success"></i>
              </div>
              <div className="elderly-text-lg font-bold text-success mb-2">
                {healthData.fallDetectionActive ? "Protection Active" : "Detection Disabled"}
              </div>
              <div className="elderly-text text-gray-600">
                {healthData.fallDetectionActive ? "Monitoring for falls" : "Fall detection is off"}
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Sensitivity: Medium</span>
                <span>Last check: {formatLastUpdate(healthData.lastUpdate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Status Overview */}
      <Card>
        <CardContent className="p-6">
          <h2 className="elderly-text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success bg-opacity-10 rounded-lg">
              <i className="fas fa-heartbeat text-2xl text-success mb-2"></i>
              <div className="elderly-text font-semibold text-gray-900">
                {avgHeartRate ? `${Math.round(avgHeartRate)} BPM` : `${healthData.heartRate} BPM`}
              </div>
              <div className="text-sm text-gray-600">Avg Heart Rate</div>
            </div>
            <div className="text-center p-4 bg-primary bg-opacity-10 rounded-lg">
              <i className="fas fa-shield-alt text-2xl text-primary mb-2"></i>
              <div className="elderly-text font-semibold text-gray-900">{fallsDetected}</div>
              <div className="text-sm text-gray-600">Falls Detected</div>
            </div>
            <div className="text-center p-4 bg-accent bg-opacity-10 rounded-lg">
              <i className="fas fa-bell text-2xl text-accent mb-2"></i>
              <div className="elderly-text font-semibold text-gray-900">{todaysAlerts.length}</div>
              <div className="text-sm text-gray-600">Alerts Sent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
