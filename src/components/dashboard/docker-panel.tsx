"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Container } from "lucide-react"

type ContainerHealth = "healthy" | "running" | "unhealthy" | "stopped"

interface DockerContainer {
  name: string
  image: string
  health: ContainerHealth
  port: string
  uptime: string
}

const containers: DockerContainer[] = [
  { name: "postgres",  image: "postgres:16",    health: "healthy",   port: "5432",    uptime: "7d" },
  { name: "redis",     image: "redis:7",        health: "healthy",   port: "6379",    uptime: "7d" },
  { name: "n8n",       image: "n8nio/n8n",      health: "healthy",   port: "5678",    uptime: "2d" },
  { name: "nginx",     image: "nginx:alpine",   health: "healthy",   port: "80/443",  uptime: "3d" },
  { name: "qdrant",    image: "qdrant/qdrant",  health: "healthy",   port: "6333",    uptime: "1d" },
  { name: "grafana",   image: "grafana/grafana",health: "running",   port: "3000",    uptime: "7d" },
  { name: "mongo",     image: "mongo:7",        health: "unhealthy", port: "27017",   uptime: "12h" },
  { name: "ollama",    image: "ollama/ollama",  health: "stopped",   port: "—",       uptime: "—" },
]

const healthBadge: Record<ContainerHealth, "success" | "cyan" | "warning" | "destructive"> = {
  healthy:   "success",
  running:   "cyan",
  unhealthy: "warning",
  stopped:   "destructive",
}

const healthDot: Record<ContainerHealth, string> = {
  healthy:   "bg-[oklch(0.75_0.22_145)]",
  running:   "bg-[oklch(0.72_0.18_200)]",
  unhealthy: "bg-[oklch(0.78_0.20_80)]",
  stopped:   "bg-muted-foreground",
}

export function DockerPanel() {
  const healthy = containers.filter((c) => c.health === "healthy" || c.health === "running").length

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Container className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Docker Containers</CardTitle>
          </div>
          <Badge variant="success">{healthy}/{containers.length} running</Badge>
        </div>
        <CardDescription>Container health overview</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-1.5">
          {containers.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${healthDot[c.health]}`} />
                <span className="font-mono text-xs font-medium truncate">{c.name}</span>
                <span className="hidden text-xs text-muted-foreground truncate sm:block">{c.image}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">{c.port}</span>
                <span className="hidden font-mono text-xs text-muted-foreground md:block">{c.uptime}</span>
                <Badge variant={healthBadge[c.health]} className="text-[10px]">{c.health}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
