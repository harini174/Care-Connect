import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: "normal" | "warning" | "error";
  icon: string;
  subtitle?: string;
  lastUpdate?: string;
  isLive?: boolean;
}

export function HealthCard({
  title,
  value,
  unit,
  status,
  icon,
  subtitle,
  lastUpdate,
  isLive = false
}: HealthCardProps) {
  const statusColors = {
    normal: "border-success",
    warning: "border-warning",
    error: "border-critical"
  };

  const statusTextColors = {
    normal: "text-success",
    warning: "text-warning",
    error: "text-critical"
  };

  const statusBgColors = {
    normal: "bg-success",
    warning: "bg-warning",
    error: "bg-critical"
  };

  return (
    <Card className={cn("card-modern border-l-4", statusColors[status])}>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="elderly-text-lg font-semibold text-foreground">{title}</h2>
          {isLive && (
            <div className="flex items-center space-x-2 bg-white/80 px-3 py-1 rounded-full">
              <div className={cn("w-3 h-3 rounded-full animate-pulse", statusBgColors[status])}></div>
              <span className={cn("text-sm font-semibold", statusTextColors[status])}>Live</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="text-7xl font-bold text-foreground mb-3 tracking-tight">
            {value}
          </div>
          {unit && (
            <div className="elderly-text text-muted-foreground mb-6 font-medium">{unit}</div>
          )}
          {subtitle && (
            <div className="flex items-center justify-center space-x-3 bg-white/60 px-4 py-2 rounded-full">
              <div className={cn("w-4 h-4 rounded-full", statusBgColors[status])}></div>
              <span className={cn("elderly-text font-semibold", statusTextColors[status])}>
                {subtitle}
              </span>
            </div>
          )}
        </div>

        {lastUpdate && (
          <div className="mt-6 text-sm text-muted-foreground text-center font-medium">
            Last updated: {lastUpdate}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
