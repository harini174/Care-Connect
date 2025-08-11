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
    <Card className="card-modern border-l-4 border-critical bg-gradient-to-r from-red-50 to-pink-50">
      <CardContent className="p-8">
        <div className="text-center">
          <Button
            onClick={handleEmergencyClick}
            disabled={isEmergencyPending}
            className="elderly-button button-critical w-full sm:w-auto min-h-[96px] text-2xl font-bold"
            aria-label="Emergency SOS Button - Press to send immediate help alert"
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-phone-alt text-4xl mb-3"></i>
              <div>{isEmergencyPending ? "SENDING..." : "EMERGENCY SOS"}</div>
              <div className="text-lg font-normal opacity-90">
                {isEmergencyPending ? "Please wait..." : "Press for Help"}
              </div>
            </div>
          </Button>
        </div>
        <p className="text-center text-muted-foreground elderly-text mt-6 font-medium">
          This will immediately alert your caregiver with your location
        </p>
      </CardContent>
    </Card>
  );
}
