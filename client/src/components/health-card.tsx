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
    <Card className={cn("border-l-4", statusColors[status])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="elderly-text-lg font-semibold text-gray-900">{title}</h2>
          {isLive && (
            <div className="flex items-center space-x-2">
              <div className={cn("w-3 h-3 rounded-full animate-pulse", statusBgColors[status])}></div>
              <span className={cn("text-sm font-medium", statusTextColors[status])}>Live</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {value}
          </div>
          {unit && (
            <div className="elderly-text text-gray-600 mb-4">{unit}</div>
          )}
          {subtitle && (
            <div className="flex items-center justify-center space-x-2">
              <div className={cn("w-4 h-4 rounded-full", statusBgColors[status])}></div>
              <span className={cn("elderly-text font-medium", statusTextColors[status])}>
                {subtitle}
              </span>
            </div>
          )}
        </div>

        {lastUpdate && (
          <div className="mt-4 text-sm text-gray-500 text-right">
            Last updated: {lastUpdate}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
