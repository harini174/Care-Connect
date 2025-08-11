import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedicineReminders } from "@/hooks/use-medicine-reminders";
import { useState } from "react";

export function MedicineReminders() {
  const { getTodaysDueMedications, markMedicineTaken } = useMedicineReminders();
  const [showAll, setShowAll] = useState(false);
  
  const dueMedications = getTodaysDueMedications();
  const overdueMedications = dueMedications.filter(med => med.isOverdue);
  const upcomingMedications = dueMedications.filter(med => !med.isOverdue);

  if (dueMedications.length === 0) {
    return (
      <Card className="mobile-card border-l-4 border-success bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="elderly-text-lg font-semibold text-foreground">Medicine Reminders</h2>
            <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-success font-semibold">All Good</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-success bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-pills text-3xl text-success"></i>
            </div>
            <p className="elderly-text text-muted-foreground font-medium">
              No medicines due right now
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mobile-card border-l-4 border-primary bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="elderly-text-lg font-semibold text-foreground">Medicine Time</h2>
          <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-primary font-semibold">
              {dueMedications.length} Due
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Overdue medications - show with urgency */}
          {overdueMedications.map((medication) => (
            <div
              key={`${medication.id}-${medication.scheduledTime}`}
              className="bg-red-50 border-2 border-red-200 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-exclamation-triangle text-red-600 text-xl mr-3"></i>
                    <div>
                      <h3 className="elderly-text font-bold text-red-800">
                        {medication.name}
                      </h3>
                      <p className="text-red-600 font-semibold">
                        {medication.dosage} • Due: {medication.scheduledTime}
                      </p>
                      <p className="text-sm text-red-500 font-medium">OVERDUE</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => markMedicineTaken(medication.id, medication.scheduledTime)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-bold"
                >
                  TAKEN
                </Button>
              </div>
            </div>
          ))}

          {/* Upcoming medications */}
          {upcomingMedications.slice(0, showAll ? undefined : 2).map((medication) => (
            <div
              key={`${medication.id}-${medication.scheduledTime}`}
              className="bg-white border-2 border-blue-200 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-pills text-primary text-xl mr-3"></i>
                    <div>
                      <h3 className="elderly-text font-bold text-foreground">
                        {medication.name}
                      </h3>
                      <p className="text-muted-foreground font-semibold">
                        {medication.dosage} • Time: {medication.scheduledTime}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => markMedicineTaken(medication.id, medication.scheduledTime)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 font-bold"
                >
                  TAKEN
                </Button>
              </div>
            </div>
          ))}

          {/* Show more/less button */}
          {upcomingMedications.length > 2 && (
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="w-full elderly-button"
            >
              {showAll ? "Show Less" : `Show ${upcomingMedications.length - 2} More`}
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/60 rounded-2xl p-4">
          <p className="text-center text-muted-foreground text-sm font-medium">
            <i className="fas fa-bell text-xs mr-2"></i>
            You'll get notifications when it's time to take your medicine
          </p>
        </div>
      </CardContent>
    </Card>
  );
}