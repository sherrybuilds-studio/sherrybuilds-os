"use client"

import { useState } from "react"
import { Checkbox } from "radix-ui"
import { CheckSquare, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TaskStatus = "done" | "in-progress" | "todo"

interface Task {
  id: string
  label: string
  status: TaskStatus
  category: string
}

const initialTasks: Task[] = [
  { id: "1", label: "Set up PM2 cluster mode",          status: "done",        category: "Infra" },
  { id: "2", label: "Deploy n8n workflows",             status: "done",        category: "Automation" },
  { id: "3", label: "Integrate Stripe webhooks",        status: "in-progress", category: "Revenue" },
  { id: "4", label: "Build eval pipeline for SalesBot", status: "in-progress", category: "AI" },
  { id: "5", label: "Launch beta for StudyBot",         status: "todo",        category: "Product" },
  { id: "6", label: "Write landing page copy",          status: "todo",        category: "Marketing" },
  { id: "7", label: "Set up Grafana alerts",            status: "todo",        category: "Infra" },
  { id: "8", label: "Publish first YouTube tutorial",   status: "todo",        category: "Content" },
]

const categoryColor: Record<string, string> = {
  Infra:      "text-[oklch(0.72_0.18_200)]",
  Automation: "text-[oklch(0.65_0.28_275)]",
  Revenue:    "text-[oklch(0.75_0.22_145)]",
  AI:         "text-[oklch(0.68_0.25_350)]",
  Product:    "text-[oklch(0.78_0.20_80)]",
  Marketing:  "text-[oklch(0.72_0.18_200)]",
  Content:    "text-[oklch(0.65_0.28_275)]",
}

export function NextStepsPanel() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t
      )
    )
  }

  const done = tasks.filter((t) => t.status === "done").length
  const pct = Math.round((done / tasks.length) * 100)

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Next Steps</CardTitle>
          </div>
          <Badge variant="outline">{done}/{tasks.length} done</Badge>
        </div>
        <CardDescription>Sprint board — click to toggle</CardDescription>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">{pct}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                task.status === "done"
                  ? "opacity-50"
                  : "hover:bg-muted/30"
              )}
              onClick={() => toggle(task.id)}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  task.status === "done"
                    ? "border-primary bg-primary"
                    : task.status === "in-progress"
                    ? "border-[oklch(0.78_0.20_80)] bg-[oklch(0.78_0.20_80/0.15)]"
                    : "border-border bg-transparent"
                )}
              >
                {task.status === "done" && <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />}
                {task.status === "in-progress" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.20_80)]" />
                )}
              </span>
              <span
                className={cn(
                  "flex-1 text-xs",
                  task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                )}
              >
                {task.label}
              </span>
              <span className={cn("hidden text-[10px] font-medium sm:block", categoryColor[task.category] ?? "text-muted-foreground")}>
                {task.category}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
