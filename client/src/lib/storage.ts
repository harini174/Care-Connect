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

const SETTINGS_KEY = 'careconnect-settings';
const ALERTS_KEY = 'careconnect-alerts';
const MEDICINE_REMINDERS_KEY = 'careconnect-medicine-reminders';
const MEDICINE_LOGS_KEY = 'careconnect-medicine-logs';

// Default caregiver information - automatically set up for the user
const getDefaultSettings = (): LocalSettings => ({
  caregiverName: "Dr. Sarah Johnson",
  caregiverPhone: "+1-555-0123",
  minHeartRate: 50,
  maxHeartRate: 120,
  fallSensitivity: "medium"
});

export const localStorageService = {
  // Settings methods
  getSettings(): LocalSettings | null {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      } else {
        // Auto-setup default caregiver information on first use
        const defaultSettings = getDefaultSettings();
        this.saveSettings(defaultSettings);
        return defaultSettings;
      }
    } catch {
      // If there's an error, return default settings
      const defaultSettings = getDefaultSettings();
      this.saveSettings(defaultSettings);
      return defaultSettings;
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
  },

  // Medicine Reminders methods
  getMedicineReminders(): LocalMedicineReminder[] {
    try {
      const stored = localStorage.getItem(MEDICINE_REMINDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveMedicineReminders(reminders: LocalMedicineReminder[]): void {
    try {
      localStorage.setItem(MEDICINE_REMINDERS_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('Failed to save medicine reminders:', error);
    }
  },

  // Medicine Logs methods
  getMedicineLogs(): LocalMedicineLog[] {
    try {
      const stored = localStorage.getItem(MEDICINE_LOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveMedicineLogs(logs: LocalMedicineLog[]): void {
    try {
      localStorage.setItem(MEDICINE_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save medicine logs:', error);
    }
  }
};

// Medicine reminder types
export interface LocalMedicineReminder {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
}

export interface LocalMedicineLog {
  id: string;
  medicineId: string;
  medicineName: string;
  scheduledTime: string;
  actualTime?: string;
  status: "taken" | "missed" | "late";
  notes?: string;
  timestamp: string;
}

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
