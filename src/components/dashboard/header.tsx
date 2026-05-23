"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"

export function DashboardHeader() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("de-DE", {
          timeZone: "Europe/Berlin",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight">SherryBuilds OS</span>
          <span className="hidden text-xs text-muted-foreground sm:block">— Mission Control</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            Berlin · {time}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.75_0.22_145)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.75_0.22_145)]" />
            </span>
            <span className="text-xs font-medium text-[oklch(0.75_0.22_145)]">Online</span>
          </div>
        </div>
      </div>
    </header>
  )
}
