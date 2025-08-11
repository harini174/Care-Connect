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

    if (heartRate < minRate) {
      return "low";
    } else if (heartRate > maxRate) {
      return "high";
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

      {/* Real-time Health Monitoring - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Heart Rate Monitoring Card - Enhanced for Mobile */}
        <Card className="mobile-card border-l-4 border-primary bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="elderly-text-lg font-semibold text-foreground">Heart Rate</h2>
              <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-semibold">Live</span>
              </div>
            </div>
            <div className="text-center">
              <div className="heart-rate-mobile text-primary font-black mb-4 tabular-nums">
                {healthData.heartRate}
              </div>
              <div className="elderly-text font-bold text-muted-foreground mb-4">BPM</div>
              <div className={`elderly-text font-bold mb-4 px-4 py-2 rounded-2xl ${
                getHeartRateStatus(healthData.heartRate) === 'normal' 
                  ? 'text-success bg-success/10 border border-success/20' 
                  : getHeartRateStatus(healthData.heartRate) === 'low'
                  ? 'text-orange-600 bg-orange-50 border border-orange-200'
                  : 'text-destructive bg-destructive/10 border border-destructive/20'
              }`}>
                {getHeartRateStatus(healthData.heartRate) === 'normal' ? 'NORMAL' : 
                 getHeartRateStatus(healthData.heartRate) === 'low' ? 'LOW' : 'HIGH'}
              </div>
              <div className="text-sm text-muted-foreground bg-white/60 p-3 rounded-xl">
                <div className="font-medium">Normal Range: 50-120 BPM</div>
                <div className="text-xs mt-1">Updated: {formatLastUpdate(healthData.lastUpdate)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fall Detection Card - Mobile Optimized */}
        <Card className="mobile-card border-l-4 border-success bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="elderly-text-lg font-semibold text-foreground">Fall Detection</h2>
              <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-semibold">Active</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 md:w-24 md:h-24 bg-success bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-success/20 shadow-inner">
                <i className="fas fa-shield-alt text-6xl md:text-4xl text-success animate-pulse"></i>
              </div>
              <div className="elderly-text-lg font-black text-success mb-4 px-4 py-2 bg-success/10 rounded-2xl border border-success/20">
                {healthData.fallDetectionActive ? "PROTECTED" : "DISABLED"}
              </div>
              <div className="elderly-text text-muted-foreground font-bold mb-4">
                {healthData.fallDetectionActive ? "Monitoring for Falls" : "Fall Detection Off"}
              </div>
              <div className="text-sm text-muted-foreground bg-white/60 p-4 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between font-bold gap-2">
                  <span>Sensitivity: Medium</span>
                  <span>Updated: {formatLastUpdate(healthData.lastUpdate)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile-Optimized Today's Summary */}
      <Card className="mobile-card bg-gradient-to-r from-gray-50 to-slate-50 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <h2 className="elderly-text-lg font-bold text-foreground mb-6 text-center">Today's Health Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-6 md:p-6 bg-white rounded-3xl shadow-md border-2 border-success/20 hover:shadow-lg transition-all touch-manipulation active:scale-95">
              <div className="w-16 h-16 md:w-12 md:h-12 bg-success bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heartbeat text-3xl md:text-2xl text-success"></i>
              </div>
              <div className="text-3xl md:text-xl font-black text-foreground mb-2">
                {avgHeartRate ? `${Math.round(avgHeartRate)}` : `${healthData.heartRate}`}
              </div>
              <div className="elderly-text-sm text-success font-bold mb-1">BPM</div>
              <div className="text-sm text-muted-foreground font-bold">Average Today</div>
            </div>
            <div className="text-center p-6 md:p-6 bg-white rounded-3xl shadow-md border-2 border-primary/20 hover:shadow-lg transition-all touch-manipulation active:scale-95">
              <div className="w-16 h-16 md:w-12 md:h-12 bg-primary bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-3xl md:text-2xl text-primary"></i>
              </div>
              <div className="text-3xl md:text-xl font-black text-foreground mb-2">{fallsDetected}</div>
              <div className="elderly-text-sm text-primary font-bold mb-1">FALLS</div>
              <div className="text-sm text-muted-foreground font-bold">Detected Today</div>
            </div>
            <div className="text-center p-6 md:p-6 bg-white rounded-3xl shadow-md border-2 border-accent/20 hover:shadow-lg transition-all touch-manipulation active:scale-95">
              <div className="w-16 h-16 md:w-12 md:h-12 bg-accent bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bell text-3xl md:text-2xl text-accent"></i>
              </div>
              <div className="text-3xl md:text-xl font-black text-foreground mb-2">{todaysAlerts.length}</div>
              <div className="elderly-text-sm text-accent font-bold mb-1">ALERTS</div>
              <div className="text-sm text-muted-foreground font-bold">Sent Today</div>
            </div>
          </div>
          
          {/* Pull-to-refresh hint for mobile */}
          <div className="mt-6 text-center text-muted-foreground text-sm font-medium bg-white/60 p-3 rounded-2xl md:hidden">
            <i className="fas fa-arrow-down text-xs mr-2"></i>
            Pull down to refresh health data
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
