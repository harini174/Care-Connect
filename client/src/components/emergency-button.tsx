import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAlertSystem } from "@/hooks/use-alert-system";
import { useHealthData } from "@/hooks/use-health-data";

export function EmergencyButton() {
  const { sendEmergencyAlert, isEmergencyPending } = useAlertSystem();
  const { healthData } = useHealthData();

  const handleEmergencyClick = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to send an emergency alert to your caregiver?"
    );
    
    if (confirmed) {
      await sendEmergencyAlert(healthData?.heartRate);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-red-500 to-red-700 border-4 border-red-300 shadow-2xl rounded-3xl overflow-visible emergency-enhanced">
      <CardContent className="p-4 md:p-6">
        {/* Emergency Header Banner */}
        <div className="bg-yellow-400 text-red-800 text-center py-2 -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-4 font-black text-lg border-b-4 border-red-600">
          🚨 EMERGENCY ASSISTANCE 🚨
        </div>
        <div className="text-center">
          <Button
            onClick={handleEmergencyClick}
            disabled={isEmergencyPending}
            className="w-full h-40 md:h-32 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-4 border-white rounded-3xl shadow-2xl pulse-animation transform hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Emergency SOS Button - Press to send immediate help alert"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-white rounded-full p-4 mb-4 shadow-inner">
                <i className="fas fa-exclamation-triangle text-red-600 text-6xl md:text-4xl animate-bounce"></i>
              </div>
              <div className="text-4xl md:text-3xl font-black mb-2 text-white drop-shadow-lg">
                {isEmergencyPending ? "SENDING" : "EMERGENCY"}
              </div>
              <div className="text-5xl md:text-4xl font-black text-yellow-300 drop-shadow-lg">
                {isEmergencyPending ? "WAIT..." : "SOS"}
              </div>
              <div className="text-lg md:text-base font-bold text-white mt-2 bg-black/20 px-4 py-1 rounded-full">
                {isEmergencyPending ? "Alerting Caregiver..." : "PRESS FOR HELP"}
              </div>
            </div>
          </Button>
        </div>
        <div className="bg-white/90 rounded-2xl p-4 mt-4 border-2 border-red-200">
          <p className="text-center text-red-800 text-xl md:text-lg font-black leading-tight">
            🚨 INSTANT ALERT TO DR. SARAH JOHNSON 🚨
          </p>
          <p className="text-center text-red-700 text-lg md:text-base font-bold mt-2">
            Location & Medical Info Sent Immediately
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
