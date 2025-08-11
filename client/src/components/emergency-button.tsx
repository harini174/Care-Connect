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
    <Card className="mobile-card border-l-4 border-destructive bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="text-center">
          <Button
            onClick={handleEmergencyClick}
            disabled={isEmergencyPending}
            className="w-full h-24 md:h-20 bg-red-600 hover:bg-red-700 text-white font-bold text-2xl md:text-xl rounded-2xl border-2 border-white shadow-lg active:scale-95 transition-all duration-200"
            aria-label="Emergency SOS Button - Press to send immediate help alert"
          >
            {isEmergencyPending ? "SENDING ALERT..." : "EMERGENCY SOS"}
          </Button>
        </div>
        <p className="text-center text-muted-foreground elderly-text mt-4 font-medium">
          Press button to alert Dr. Sarah Johnson immediately
        </p>
      </CardContent>
    </Card>
  );
}
