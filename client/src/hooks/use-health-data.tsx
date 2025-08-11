import { useState, useEffect } from "react";
import { healthSimulation, HealthData } from "@/lib/health-simulation";

export function useHealthData() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = healthSimulation.subscribe((data) => {
      setHealthData(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    healthData,
    isLoading,
    // Utility methods for testing
    simulateHighHeartRate: () => healthSimulation.simulateHighHeartRate(),
    simulateLowHeartRate: () => healthSimulation.simulateLowHeartRate(),
    resetToNormal: () => healthSimulation.resetToNormal(),
    toggleFallDetection: () => healthSimulation.toggleFallDetection()
  };
}
