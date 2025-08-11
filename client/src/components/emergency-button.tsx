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
    <Card className="mobile-card border-l-4 border-critical bg-gradient-to-r from-red-50 to-pink-50 shadow-xl">
      <CardContent className="p-6 md:p-8">
        <div className="text-center">
          <Button
            onClick={handleEmergencyClick}
            disabled={isEmergencyPending}
            className="emergency-btn-mobile button-critical border-4 border-white/30 pulse-animation"
            aria-label="Emergency SOS Button - Press to send immediate help alert"
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-phone-alt text-5xl md:text-4xl mb-3 animate-pulse"></i>
              <div className="text-3xl md:text-2xl leading-tight">
                {isEmergencyPending ? "SENDING..." : "EMERGENCY"}
              </div>
              <div className="text-3xl md:text-2xl font-black">
                {isEmergencyPending ? "PLEASE WAIT" : "SOS"}
              </div>
              <div className="text-xl md:text-lg font-normal opacity-90 mt-2">
                {isEmergencyPending ? "Contacting caregiver..." : "Tap for Immediate Help"}
              </div>
            </div>
          </Button>
        </div>
        <p className="text-center text-muted-foreground elderly-text mt-6 font-bold leading-relaxed">
          This will immediately alert Dr. Sarah Johnson with your exact location
        </p>
      </CardContent>
    </Card>
  );
}
