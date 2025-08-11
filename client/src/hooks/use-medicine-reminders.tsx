import { useState, useEffect, useCallback } from "react";
import { localStorageService, type LocalMedicineReminder, type LocalMedicineLog } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export function useMedicineReminders() {
  const [reminders, setReminders] = useState<LocalMedicineReminder[]>([]);
  const [logs, setLogs] = useState<LocalMedicineLog[]>([]);
  const { toast } = useToast();

  // Load reminders and logs on mount
  useEffect(() => {
    const loadedReminders = localStorageService.getMedicineReminders();
    const loadedLogs = localStorageService.getMedicineLogs();
    setReminders(loadedReminders);
    setLogs(loadedLogs);
  }, []);

  // Check for due medications every minute
  useEffect(() => {
    const checkDueMedications = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0];

      reminders.forEach(reminder => {
        if (!reminder.isActive) return;

        // Check if reminder is within date range
        const startDate = new Date(reminder.startDate);
        const endDate = reminder.endDate ? new Date(reminder.endDate) : null;
        
        if (now < startDate || (endDate && now > endDate)) return;

        // Check if any scheduled time matches current time
        reminder.times.forEach(scheduledTime => {
          if (scheduledTime === currentTime) {
            // Check if already taken today
            const alreadyTaken = logs.some(log => 
              log.medicineId === reminder.id &&
              log.scheduledTime === scheduledTime &&
              log.timestamp.startsWith(today) &&
              log.status === 'taken'
            );

            if (!alreadyTaken) {
              showMedicineNotification(reminder, scheduledTime);
            }
          }
        });
      });
    };

    const interval = setInterval(checkDueMedications, 60000); // Check every minute
    checkDueMedications(); // Check immediately

    return () => clearInterval(interval);
  }, [reminders, logs, toast]);

  const showMedicineNotification = (reminder: LocalMedicineReminder, scheduledTime: string) => {
    toast({
      title: "💊 Medicine Time!",
      description: `Time to take ${reminder.name} (${reminder.dosage})`,
      variant: "default",
      duration: 0, // Don't auto-dismiss
    });

    // Also show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medicine Reminder', {
        body: `Time to take ${reminder.name} (${reminder.dosage})`,
        icon: '/favicon.ico',
        tag: reminder.id,
      });
    }
  };

  const addReminder = useCallback((reminder: Omit<LocalMedicineReminder, 'id'>) => {
    const newReminder: LocalMedicineReminder = {
      ...reminder,
      id: crypto.randomUUID(),
    };
    
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorageService.saveMedicineReminders(updatedReminders);
    
    toast({
      title: "Medicine Reminder Added",
      description: `${newReminder.name} reminder has been set up successfully.`,
      variant: "default",
    });
  }, [reminders, toast]);

  const updateReminder = useCallback((id: string, updates: Partial<LocalMedicineReminder>) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, ...updates } : reminder
    );
    setReminders(updatedReminders);
    localStorageService.saveMedicineReminders(updatedReminders);
    
    toast({
      title: "Medicine Reminder Updated",
      description: "Your medicine reminder has been updated successfully.",
      variant: "default",
    });
  }, [reminders, toast]);

  const deleteReminder = useCallback((id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorageService.saveMedicineReminders(updatedReminders);
    
    toast({
      title: "Medicine Reminder Deleted",
      description: "The medicine reminder has been removed.",
      variant: "default",
    });
  }, [reminders, toast]);

  const markMedicineTaken = useCallback((medicineId: string, scheduledTime: string, notes?: string) => {
    const reminder = reminders.find(r => r.id === medicineId);
    if (!reminder) return;

    const now = new Date();
    const actualTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Determine if medicine was taken on time, late, etc.
    const scheduledMinutes = parseInt(scheduledTime.split(':')[0]) * 60 + parseInt(scheduledTime.split(':')[1]);
    const actualMinutes = parseInt(actualTime.split(':')[0]) * 60 + parseInt(actualTime.split(':')[1]);
    const minutesLate = actualMinutes - scheduledMinutes;
    
    let status: "taken" | "late" = "taken";
    if (minutesLate > 30) status = "late"; // More than 30 minutes late

    const newLog: LocalMedicineLog = {
      id: crypto.randomUUID(),
      medicineId,
      medicineName: reminder.name,
      scheduledTime,
      actualTime,
      status,
      notes,
      timestamp: now.toISOString(),
    };

    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorageService.saveMedicineLogs(updatedLogs);
    
    toast({
      title: "Medicine Taken",
      description: `${reminder.name} marked as ${status === 'late' ? 'taken late' : 'taken on time'}.`,
      variant: status === 'late' ? "destructive" : "default",
    });
  }, [reminders, logs, toast]);

  const getTodaysDueMedications = useCallback(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    const dueMedications: (LocalMedicineReminder & { scheduledTime: string; isOverdue: boolean })[] = [];

    reminders.forEach(reminder => {
      if (!reminder.isActive) return;

      // Check if reminder is within date range
      const startDate = new Date(reminder.startDate);
      const endDate = reminder.endDate ? new Date(reminder.endDate) : null;
      
      if (now < startDate || (endDate && now > endDate)) return;

      reminder.times.forEach(scheduledTime => {
        // Check if already taken today
        const alreadyTaken = logs.some(log => 
          log.medicineId === reminder.id &&
          log.scheduledTime === scheduledTime &&
          log.timestamp.startsWith(today) &&
          log.status === 'taken'
        );

        // Check if it's due (current time or past due)
        const scheduledMinutes = parseInt(scheduledTime.split(':')[0]) * 60 + parseInt(scheduledTime.split(':')[1]);
        const currentMinutes = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
        
        if (currentMinutes >= scheduledMinutes && !alreadyTaken) {
          dueMedications.push({
            ...reminder,
            scheduledTime,
            isOverdue: currentMinutes > scheduledMinutes + 30, // 30 min grace period
          });
        }
      });
    });

    return dueMedications;
  }, [reminders, logs]);

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    reminders,
    logs,
    addReminder,
    updateReminder,
    deleteReminder,
    markMedicineTaken,
    getTodaysDueMedications,
  };
}