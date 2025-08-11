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

  const settings = localStorageService.getSettings();

  return (
    <div className="space-y-6">
      {/* Caregiver Status Card */}
      <Card className="card-modern border-l-4 border-success bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-success bg-opacity-20 rounded-xl flex items-center justify-center">
                <i className="fas fa-user-shield text-2xl text-success"></i>
              </div>
              <div>
                <h3 className="elderly-text font-bold text-foreground">Emergency Contact Ready</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {settings?.caregiverName} • {settings?.caregiverPhone}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-semibold">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
        <Card className="card-modern border-l-4 border-primary bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="elderly-text-lg font-semibold text-foreground">Fall Detection</h2>
              <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-semibold">Active</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-success bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-success/20">
                <i className="fas fa-shield-alt text-4xl text-success"></i>
              </div>
              <div className="elderly-text-lg font-bold text-success mb-3">
                {healthData.fallDetectionActive ? "Protection Active" : "Detection Disabled"}
              </div>
              <div className="elderly-text text-muted-foreground font-medium">
                {healthData.fallDetectionActive ? "Monitoring for falls" : "Fall detection is off"}
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground bg-white/60 p-4 rounded-xl">
              <div className="flex justify-between font-medium">
                <span>Sensitivity: Medium</span>
                <span>Last check: {formatLastUpdate(healthData.lastUpdate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Status Overview */}
      <Card className="card-modern bg-gradient-to-r from-gray-50 to-slate-50">
        <CardContent className="p-8">
          <h2 className="elderly-text-lg font-semibold text-foreground mb-6">Today's Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-success/20 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-success bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heartbeat text-2xl text-success"></i>
              </div>
              <div className="elderly-text font-bold text-foreground mb-1">
                {avgHeartRate ? `${Math.round(avgHeartRate)} BPM` : `${healthData.heartRate} BPM`}
              </div>
              <div className="text-sm text-muted-foreground font-medium">Avg Heart Rate</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-primary/20 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-primary"></i>
              </div>
              <div className="elderly-text font-bold text-foreground mb-1">{fallsDetected}</div>
              <div className="text-sm text-muted-foreground font-medium">Falls Detected</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-accent/20 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bell text-2xl text-accent"></i>
              </div>
              <div className="elderly-text font-bold text-foreground mb-1">{todaysAlerts.length}</div>
              <div className="text-sm text-muted-foreground font-medium">Alerts Sent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
