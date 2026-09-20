import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex rounded-sm border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
  {
    variants: {
      variant: {
        default: "border-border bg-bg-deep text-text-muted",
        available: "border-status-success-border bg-status-success-bg text-text-success",
        preorder: "border-brand-mid bg-brand text-text-accent",
        unavailable: "border-border bg-bg-surface text-text-muted",
        paid: "border-border/40 bg-brand text-text-accent",
        pending: "border-border bg-bg-deep text-text-muted",
        success: "border-status-success-border bg-status-success-bg text-text-success",
        failed: "border-brand-mid bg-brand text-text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
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
