import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localStorageService, LocalAlert } from "@/lib/storage";
import { formatDistanceToNow } from "date-fns";

interface HistoryProps {
  onBack: () => void;
}

export function History({ onBack }: HistoryProps) {
  const [localAlerts, setLocalAlerts] = useState<LocalAlert[]>([]);

  // Load local alerts
  useEffect(() => {
    const alerts = localStorageService.getAlerts();
    setLocalAlerts(alerts);
  }, []);

  // Also fetch server alerts
  const { data: serverAlerts = [] } = useQuery({
    queryKey: ["/api/alerts"],
  });

  // Combine and sort alerts
  const allAlerts = [...localAlerts, ...serverAlerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return { icon: "fas fa-user-shield", color: "text-critical bg-critical" };
      case "heart_rate":
        return { icon: "fas fa-heart", color: "text-warning bg-warning" };
      case "fall_detection":
        return { icon: "fas fa-exclamation-triangle", color: "text-critical bg-critical" };
      case "test":
        return { icon: "fas fa-check", color: "text-success bg-success" };
      default:
        return { icon: "fas fa-bell", color: "text-primary bg-primary" };
    }
  };

  const formatAlertTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (date.toDateString() === new Date(now.getTime() - 86400000).toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          aria-label="Back to Dashboard"
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </Button>
        <h2 className="elderly-text-xl font-bold text-gray-900">Alert History</h2>
      </div>

      {/* Alert History List */}
      <Card className="card-modern">
        <CardContent className="p-0">
          {allAlerts.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-history text-3xl"></i>
              </div>
              <p className="elderly-text-lg font-semibold mb-2">No alerts recorded yet</p>
              <p className="elderly-text">Your alert history will appear here</p>
            </div>
          ) : (
            allAlerts.map((alert, index) => {
              const alertStyle = getAlertIcon(alert.type);
              return (
                <div 
                  key={`${alert.id || index}-${alert.timestamp}`}
                  className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start space-x-5">
                    <div className={`w-14 h-14 ${alertStyle.color} bg-opacity-20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-current/10`}>
                      <i className={`${alertStyle.icon} ${alertStyle.color} text-xl`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="elderly-text font-bold text-foreground capitalize">
                          {alert.type.replace("_", " ")} Alert
                        </h3>
                        <span className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">
                          {formatAlertTime(alert.timestamp)}
                        </span>
                      </div>
                      <p className="elderly-text text-muted-foreground mb-4 font-medium">
                        {alert.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-accent"></i>
                          <span className="font-medium">{alert.location}</span>
                        </div>
                        {alert.heartRate && (
                          <div className="flex items-center gap-2">
                            <i className="fas fa-heartbeat text-success"></i>
                            <span className="font-medium">{alert.heartRate} BPM</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
