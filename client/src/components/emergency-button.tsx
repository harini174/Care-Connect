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
    <Card className="border-l-4 border-critical">
      <CardContent className="p-6">
        <div className="text-center">
          <Button
            onClick={handleEmergencyClick}
            disabled={isEmergencyPending}
            className="w-full sm:w-auto bg-critical hover:bg-red-700 text-white font-bold py-6 px-12 elderly-text-xl shadow-lg transform hover:scale-105 transition-all duration-200 min-h-[80px] border-4 border-red-800"
            aria-label="Emergency SOS Button - Press to send immediate help alert"
          >
            <div className="flex flex-col items-center">
              <i className="fas fa-phone text-3xl mb-2"></i>
              <div>{isEmergencyPending ? "SENDING..." : "EMERGENCY SOS"}</div>
              <div className="text-lg font-normal">
                {isEmergencyPending ? "Please wait..." : "Press for Help"}
              </div>
            </div>
          </Button>
        </div>
        <p className="text-center text-gray-600 elderly-text mt-4">
          This will immediately alert your caregiver with your location
        </p>
      </CardContent>
    </Card>
  );
}
