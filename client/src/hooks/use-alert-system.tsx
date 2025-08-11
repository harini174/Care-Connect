import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { localStorageService, getSimulatedLocation } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export function useAlertSystem() {
  const [isEmergencyPending, setIsEmergencyPending] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const emergencyAlertMutation = useMutation({
    mutationFn: async (data: { heartRate?: number }) => {
      const location = getSimulatedLocation();
      const response = await apiRequest("POST", "/api/emergency-alert", {
        location,
        heartRate: data.heartRate
      });
      return response.json();
    },
    onSuccess: () => {
      // Add to local storage as well
      localStorageService.addAlert({
        type: "emergency",
        description: "Emergency SOS button pressed",
        location: getSimulatedLocation(),
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      
      toast({
        title: "Emergency Alert Sent",
        description: "Your caregiver has been notified with your location.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Alert Failed",
        description: "Failed to send emergency alert. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsEmergencyPending(false);
    }
  });

  const testAlertMutation = useMutation({
    mutationFn: async (caregiverPhone: string) => {
      const response = await apiRequest("POST", "/api/test-alert", {
        caregiverPhone
      });
      return response.json();
    },
    onSuccess: () => {
      localStorageService.addAlert({
        type: "test",
        description: "Test SMS sent successfully",
        location: "Test alert",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      
      toast({
        title: "Test Alert Sent",
        description: "Test SMS sent successfully to your caregiver.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Test Failed",
        description: "Failed to send test alert. Please try again.",
        variant: "destructive",
      });
    }
  });

  const sendEmergencyAlert = async (heartRate?: number) => {
    if (isEmergencyPending) return;
    
    setIsEmergencyPending(true);
    emergencyAlertMutation.mutate({ heartRate });
  };

  const sendTestAlert = async (caregiverPhone: string) => {
    if (!caregiverPhone) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter a caregiver phone number first.",
        variant: "destructive",
      });
      return;
    }
    
    testAlertMutation.mutate(caregiverPhone);
  };

  const checkHeartRateAlert = (heartRate: number, minRate: number, maxRate: number) => {
    if (heartRate < minRate || heartRate > maxRate) {
      const alertType = heartRate < minRate ? "low" : "high";
      const description = `Heart rate ${alertType === "low" ? "dropped to" : "exceeded"} ${heartRate} BPM`;
      
      // Add to local storage
      localStorageService.addAlert({
        type: "heart_rate",
        description,
        location: getSimulatedLocation(),
        heartRate
      });
      
      toast({
        title: "Heart Rate Alert",
        description,
        variant: "destructive",
      });
      
      return true;
    }
    return false;
  };

  return {
    sendEmergencyAlert,
    sendTestAlert,
    checkHeartRateAlert,
    isEmergencyPending: isEmergencyPending || emergencyAlertMutation.isPending,
    isTestPending: testAlertMutation.isPending
  };
}
