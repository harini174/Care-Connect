import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMedicineReminders } from "@/hooks/use-medicine-reminders";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Clock, Pill } from "lucide-react";

interface MedicinesProps {
  onBack: () => void;
}

export function Medicines({ onBack }: MedicinesProps) {
  const { reminders, addReminder, deleteReminder, updateReminder, logs } = useMedicineReminders();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    times: [""],
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    notes: "",
  });

  const handleAddMedicine = () => {
    if (!formData.name || !formData.dosage || !formData.times[0]) {
      toast({
        title: "Missing Information",
        description: "Please fill in medicine name, dosage, and at least one time.",
        variant: "destructive",
      });
      return;
    }

    const validTimes = formData.times.filter(time => time.trim() !== "");
    
    addReminder({
      name: formData.name,
      dosage: formData.dosage,
      times: validTimes,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      isActive: true,
    });

    // Reset form
    setFormData({
      name: "",
      dosage: "",
      times: [""],
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      notes: "",
    });
    setShowAddForm(false);
  };

  const addTimeSlot = () => {
    setFormData({ ...formData, times: [...formData.times, ""] });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const removeTimeSlot = (index: number) => {
    if (formData.times.length > 1) {
      const newTimes = formData.times.filter((_, i) => i !== index);
      setFormData({ ...formData, times: newTimes });
    }
  };

  const toggleReminderStatus = (id: string, isActive: boolean) => {
    updateReminder(id, { isActive: !isActive });
  };

  const getTakenCount = (medicineId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return logs.filter(log => 
      log.medicineId === medicineId && 
      log.timestamp.startsWith(today) &&
      log.status === 'taken'
    ).length;
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="elderly-button p-2"
        >
          <ChevronLeft size={24} />
        </Button>
        <h2 className="elderly-text-xl font-bold text-gray-900">Medicine Reminders</h2>
      </div>

      {/* Add Medicine Button */}
      <Card className="mobile-card border-l-4 border-primary bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          {!showAddForm ? (
            <div className="text-center">
              <Button
                onClick={() => setShowAddForm(true)}
                className="elderly-button button-primary w-full"
              >
                <Plus size={24} className="mr-2" />
                Add New Medicine
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="elderly-text-lg font-semibold text-foreground mb-4">Add Medicine Reminder</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medicine-name" className="elderly-text font-semibold">Medicine Name</Label>
                  <Input
                    id="medicine-name"
                    className="elderly-input mt-2"
                    placeholder="e.g., Aspirin, Vitamin D"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="dosage" className="elderly-text font-semibold">Dosage</Label>
                  <Input
                    id="dosage"
                    className="elderly-input mt-2"
                    placeholder="e.g., 1 tablet, 5mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>

                <div>
                  <Label className="elderly-text font-semibold">Times to Take</Label>
                  <div className="space-y-3 mt-2">
                    {formData.times.map((time, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="time"
                          className="elderly-input flex-1"
                          value={time}
                          onChange={(e) => updateTimeSlot(index, e.target.value)}
                        />
                        {formData.times.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTimeSlot(index)}
                            className="px-3"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addTimeSlot}
                      className="w-full"
                    >
                      <Clock size={20} className="mr-2" />
                      Add Another Time
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="elderly-text font-semibold">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      className="elderly-input mt-2"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="elderly-text font-semibold">End Date (Optional)</Label>
                    <Input
                      id="end-date"
                      type="date"
                      className="elderly-input mt-2"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="elderly-text font-semibold">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    className="elderly-input mt-2"
                    placeholder="Take with food, special instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={handleAddMedicine} className="elderly-button button-primary flex-1">
                  Save Medicine
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)} 
                  className="elderly-button flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Medicines */}
      <div className="space-y-4">
        <h3 className="elderly-text-lg font-semibold text-foreground">Your Medicines</h3>
        
        {reminders.length === 0 ? (
          <Card className="mobile-card">
            <CardContent className="p-6 text-center">
              <Pill size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="elderly-text text-muted-foreground">No medicines added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first medicine reminder above
              </p>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder.id} className="mobile-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="elderly-text font-bold text-foreground">{reminder.name}</h4>
                    <p className="text-muted-foreground font-medium">{reminder.dosage}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={reminder.isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleReminderStatus(reminder.id, reminder.isActive)}
                      className="elderly-text-xs"
                    >
                      {reminder.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                      className="elderly-text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Times:</p>
                    <div className="flex flex-wrap gap-2">
                      {reminder.times.map((time, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      Status: <span className={reminder.isActive ? "text-success" : "text-muted-foreground"}>
                        {reminder.isActive ? "Active" : "Disabled"}
                      </span>
                    </span>
                    <span className="font-medium">
                      Taken today: <span className="text-primary font-bold">{getTakenCount(reminder.id)}</span>
                    </span>
                  </div>

                  {reminder.notes && (
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {reminder.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}