"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

const data = [
  { month: "May",  target: 3000, actual: 2840 },
  { month: "Jun",  target: 4000, actual: null },
  { month: "Jul",  target: 5000, actual: null },
  { month: "Aug",  target: 6000, actual: null },
  { month: "Sep",  target: 7500, actual: null },
  { month: "Oct",  target: 9000, actual: null },
  { month: "Nov",  target: 9500, actual: null },
  { month: "Dec",  target: 10000, actual: null },
]

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number | null; fill: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label} 2026</p>
      {payload.map((p) =>
        p.value != null ? (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.fill }} />
            <span className="text-muted-foreground capitalize">{p.name}</span>
            <span className="ml-auto font-mono font-medium">€{p.value.toLocaleString()}</span>
          </div>
        ) : null
      )}
    </div>
  )
}

export function IncomeRoadmapPanel() {
  const currentActual = data.find((d) => d.actual != null)?.actual ?? 0
  const yearTarget = 10000

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Income Roadmap</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Dec goal</span>
            <Badge variant="success">€{yearTarget.toLocaleString()}/mo</Badge>
          </div>
        </div>
        <CardDescription>
          Monthly revenue target — currently{" "}
          <span className="font-medium text-foreground">€{currentActual.toLocaleString()}</span> in May 2026
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-56" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barGap={3}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(1 0 0 / 6%)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(0.62 0.02 265)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.62 0.02 265)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${v >= 1000 ? `${v / 1000}k` : v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
              <Bar
                dataKey="target"
                fill="oklch(0.65 0.28 275 / 30%)"
                radius={[4, 4, 0, 0]}
                name="target"
              />
              <Bar
                dataKey="actual"
                fill="oklch(0.65 0.28 275)"
                radius={[4, 4, 0, 0]}
                name="actual"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-sm bg-[oklch(0.65_0.28_275/0.30)]" />
              Target
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-sm bg-[oklch(0.65_0.28_275)]" />
              Actual
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round((currentActual / yearTarget) * 100)}% of Dec goal reached
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
