"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot } from "lucide-react"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const data = days.map((day, i) => ({
  day,
  StudyBot:   [82, 84, 83, 87, 89, 91, 93][i],
  SalesBot:   [71, 73, 76, 74, 78, 80, 83][i],
  SupportBot: [88, 87, 90, 91, 89, 92, 94][i],
}))

const bots = [
  { name: "StudyBot",   color: "oklch(0.65 0.28 275)", current: 93, delta: "+2" },
  { name: "SalesBot",   color: "oklch(0.72 0.18 200)", current: 83, delta: "+3" },
  { name: "SupportBot", color: "oklch(0.75 0.22 145)", current: 94, delta: "+2" },
]

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-mono font-medium">{p.value}%</span>
        </div>
      ))}
    </div>
  )
}

export function EvalScoresPanel() {
  const avg = Math.round(bots.reduce((s, b) => s + b.current, 0) / bots.length)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Bot Eval Scores</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">7-day avg</span>
            <Badge variant="default">{avg}%</Badge>
          </div>
        </div>
        <CardDescription>Evaluation performance over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          {/* Bot score cards */}
          <div className="flex shrink-0 flex-col gap-3 sm:w-48">
            {bots.map((bot) => (
              <div
                key={bot.name}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: bot.color }}
                  />
                  <span className="text-xs font-medium">{bot.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-semibold">{bot.current}%</span>
                  <span className="text-xs text-[oklch(0.75_0.22_145)]">{bot.delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="h-52 min-w-0 flex-1" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(1 0 0 / 6%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "oklch(0.62 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{ fontSize: 11, fill: "oklch(0.62 0.02 265)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                {bots.map((bot) => (
                  <Line
                    key={bot.name}
                    type="monotone"
                    dataKey={bot.name}
                    stroke={bot.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
