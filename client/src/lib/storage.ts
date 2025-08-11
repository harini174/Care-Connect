export interface LocalSettings {
  caregiverName: string;
  caregiverPhone: string;
  minHeartRate: number;
  maxHeartRate: number;
  fallSensitivity: 'low' | 'medium' | 'high';
}

export interface LocalAlert {
  id: string;
  type: 'emergency' | 'heart_rate' | 'fall_detection' | 'test';
  description: string;
  location: string;
  timestamp: Date;
  heartRate?: number;
}

const SETTINGS_KEY = 'eldercare-settings';
const ALERTS_KEY = 'eldercare-alerts';

export const localStorageService = {
  // Settings methods
  getSettings(): LocalSettings | null {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveSettings(settings: LocalSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Alerts methods
  getAlerts(): LocalAlert[] {
    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      if (!stored) return [];
      
      const alerts = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return alerts.map((alert: any) => ({
        ...alert,
        timestamp: new Date(alert.timestamp)
      }));
    } catch {
      return [];
    }
  },

  addAlert(alert: Omit<LocalAlert, 'id' | 'timestamp'>): LocalAlert {
    const newAlert: LocalAlert = {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    try {
      const alerts = this.getAlerts();
      alerts.unshift(newAlert); // Add to beginning
      
      // Keep only the last 50 alerts
      const limitedAlerts = alerts.slice(0, 50);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(limitedAlerts));
    } catch (error) {
      console.error('Failed to save alert:', error);
    }

    return newAlert;
  },

  clearAlerts(): void {
    try {
      localStorage.removeItem(ALERTS_KEY);
    } catch (error) {
      console.error('Failed to clear alerts:', error);
    }
  }
};

// GPS simulation
export const getSimulatedLocation = (): string => {
  const locations = [
    "123 Main St, Anytown, ST 12345",
    "456 Oak Ave, Somewhere, ST 67890",
    "789 Pine Rd, Another City, ST 54321",
    "321 Elm St, Hometown, ST 98765"
  ];
  
  return locations[Math.floor(Math.random() * locations.length)];
};
