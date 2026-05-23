import { Card, CardContent } from "@/components/ui/card"
import { Server, Container, Bot, DollarSign } from "lucide-react"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
}

function StatCard({ icon, label, value, sub, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in oklch, ${color} 15%, transparent)` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="font-semibold leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={<Server className="h-4 w-4" />}
        label="PM2 Processes"
        value="5 / 6 online"
        sub="1 stopped"
        color="oklch(0.65 0.28 275)"
      />
      <StatCard
        icon={<Container className="h-4 w-4" />}
        label="Docker Containers"
        value="6 / 8 healthy"
        sub="1 unhealthy · 1 stopped"
        color="oklch(0.72 0.18 200)"
      />
      <StatCard
        icon={<Bot className="h-4 w-4" />}
        label="Avg Eval Score"
        value="90.0%"
        sub="+2.3pp this week"
        color="oklch(0.75 0.22 145)"
      />
      <StatCard
        icon={<DollarSign className="h-4 w-4" />}
        label="May Revenue"
        value="€2,840"
        sub="94.7% of €3,000 target"
        color="oklch(0.78 0.20 80)"
      />
    </div>
  )
}
