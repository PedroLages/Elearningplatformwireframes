import { Card, CardContent } from "@/app/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/app/components/ui/utils"

interface StatsCardProps {
  label: string
  value: number
  icon: LucideIcon
  trend?: {
    value: number
    direction: "up" | "down"
    period: string
  }
  sparkline?: number[] // Last 7 days data
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  sparkline,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-200 cursor-pointer rounded-2xl overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>

            {/* Trend indicator */}
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium mt-2",
                  trend.direction === "up" ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {trend.direction === "up" ? "+" : ""}
                  {trend.value} {trend.period}
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Sparkline */}
        {sparkline && sparkline.length > 0 && (
          <div className="h-8 flex items-end gap-0.5">
            {sparkline.map((value, i) => {
              const max = Math.max(...sparkline)
              const height = max > 0 ? (value / max) * 100 : 0
              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-t transition-all hover:bg-blue-400"
                  style={{ height: `${height}%`, minHeight: "4px" }}
                />
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
