import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary",
        success: "bg-[oklch(0.75_0.22_145/0.15)] text-[oklch(0.75_0.22_145)]",
        warning: "bg-[oklch(0.78_0.20_80/0.15)] text-[oklch(0.78_0.20_80)]",
        destructive: "bg-[oklch(0.65_0.22_25/0.15)] text-[oklch(0.65_0.22_25)]",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-muted-foreground",
        cyan: "bg-[oklch(0.72_0.18_200/0.15)] text-[oklch(0.72_0.18_200)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
