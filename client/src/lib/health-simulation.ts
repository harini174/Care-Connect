export interface HealthData {
  heartRate: number;
  fallDetectionActive: boolean;
  lastUpdate: Date;
}

export class HealthSimulation {
  private baseHeartRate = 78;
  private currentHeartRate = 78;
  private fallDetectionActive = true;
  private callbacks: ((data: HealthData) => void)[] = [];

  constructor() {
    this.startSimulation();
  }

  subscribe(callback: (data: HealthData) => void) {
    this.callbacks.push(callback);
    // Immediately call with current data
    callback(this.getCurrentData());
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private startSimulation() {
    // Update heart rate every 5 seconds
    setInterval(() => {
      this.updateHeartRate();
      this.notifyCallbacks();
    }, 5000);
  }

  private updateHeartRate() {
    // Simulate natural heart rate variation (±5 BPM)
    const variation = (Math.random() - 0.5) * 10;
    this.currentHeartRate = Math.max(
      60,
      Math.min(100, this.baseHeartRate + variation)
    );
  }

  private notifyCallbacks() {
    const data = this.getCurrentData();
    this.callbacks.forEach(callback => callback(data));
  }

  private getCurrentData(): HealthData {
    return {
      heartRate: Math.round(this.currentHeartRate),
      fallDetectionActive: this.fallDetectionActive,
      lastUpdate: new Date()
    };
  }

  // Methods for testing different scenarios
  simulateHighHeartRate() {
    this.currentHeartRate = 125;
    this.notifyCallbacks();
  }

  simulateLowHeartRate() {
    this.currentHeartRate = 45;
    this.notifyCallbacks();
  }

  resetToNormal() {
    this.currentHeartRate = this.baseHeartRate;
    this.notifyCallbacks();
  }

  toggleFallDetection() {
    this.fallDetectionActive = !this.fallDetectionActive;
    this.notifyCallbacks();
  }
}

// Global singleton instance
export const healthSimulation = new HealthSimulation();
