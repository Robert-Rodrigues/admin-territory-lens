import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const variantStyles = {
  default: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
  success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
  warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
  danger: "border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10",
  info: "border-info/20 bg-gradient-to-br from-info/5 to-info/10",
};

const iconVariantStyles = {
  default: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  danger: "text-danger bg-danger/10",
  info: "text-info bg-info/10",
};

const valueVariantStyles = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
  onClick,
  isActive = false,
}: MetricCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden border-2 p-4 sm:p-6 transition-smooth",
        variantStyles[variant],
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95",
        isActive && "ring-4 ring-primary shadow-xl scale-105 border-primary",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">{title}</p>
          <p className={cn("text-2xl sm:text-3xl font-bold tracking-tight", valueVariantStyles[variant])}>
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium mt-2",
                trend.isPositive ? "text-success" : "text-danger"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-2 sm:p-3 rounded-xl transition-smooth",
            iconVariantStyles[variant]
          )}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </Card>
  );
};
