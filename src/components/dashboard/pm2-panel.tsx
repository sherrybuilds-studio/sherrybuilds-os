"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

type ProcessStatus = "online" | "stopped" | "errored"

interface PM2Process {
  name: string
  pid: number | null
  status: ProcessStatus
  cpu: number
  memory: string
  uptime: string
  restarts: number
}

const processes: PM2Process[] = [
  { name: "api-server",       pid: 4821, status: "online",  cpu: 2.1, memory: "124 MB", uptime: "3d 4h",  restarts: 0 },
  { name: "worker",           pid: 4822, status: "online",  cpu: 0.8, memory: "87 MB",  uptime: "3d 4h",  restarts: 1 },
  { name: "scheduler",        pid: 4823, status: "online",  cpu: 0.1, memory: "42 MB",  uptime: "2d 18h", restarts: 0 },
  { name: "webhook-handler",  pid: 4824, status: "online",  cpu: 0.3, memory: "38 MB",  uptime: "2d 18h", restarts: 0 },
  { name: "bot-runner",       pid: 4825, status: "online",  cpu: 1.2, memory: "156 MB", uptime: "1d 6h",  restarts: 2 },
  { name: "n8n-agent",        pid: null, status: "stopped", cpu: 0,   memory: "—",      uptime: "—",      restarts: 4 },
]

const statusVariant: Record<ProcessStatus, "success" | "destructive" | "warning"> = {
  online: "success",
  stopped: "destructive",
  errored: "warning",
}

export function PM2Panel() {
  const online = processes.filter((p) => p.status === "online").length

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <CardTitle>PM2 Processes</CardTitle>
          </div>
          <Badge variant="success">{online}/{processes.length} online</Badge>
        </div>
        <CardDescription>Node.js process cluster</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                <th className="hidden px-3 py-2 text-right font-medium text-muted-foreground sm:table-cell">CPU</th>
                <th className="hidden px-3 py-2 text-right font-medium text-muted-foreground md:table-cell">Memory</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Uptime</th>
                <th className="hidden px-3 py-2 text-right font-medium text-muted-foreground lg:table-cell">↺</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, i) => (
                <tr
                  key={p.name}
                  className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/20" : ""}`}
                >
                  <td className="px-3 py-2.5 font-mono font-medium">{p.name}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="hidden px-3 py-2.5 text-right font-mono text-muted-foreground sm:table-cell">
                    {p.cpu > 0 ? `${p.cpu}%` : "—"}
                  </td>
                  <td className="hidden px-3 py-2.5 text-right font-mono text-muted-foreground md:table-cell">
                    {p.memory}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">{p.uptime}</td>
                  <td className="hidden px-3 py-2.5 text-right font-mono text-muted-foreground lg:table-cell">
                    {p.restarts > 0 ? (
                      <span className="text-[oklch(0.78_0.20_80)]">{p.restarts}</span>
                    ) : (
                      p.restarts
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
