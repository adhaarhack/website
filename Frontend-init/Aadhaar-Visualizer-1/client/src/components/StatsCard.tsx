import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  className,
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className={cn(
        "overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300", 
        className
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground font-body">
            {title}
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-display tracking-tight text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className={cn(
                "font-medium", 
                trendUp ? "text-green-600" : "text-red-600"
              )}>
                {trend}
              </span>
              <span>from last month</span>
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
