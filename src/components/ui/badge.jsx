import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-vault-cyan to-vault-violet text-void",
        outline: "border-border-line text-mist-dim",
        legendary: "border-legendary/40 bg-legendary/10 text-legendary",
        epic: "border-epic/40 bg-epic/10 text-epic",
        rare: "border-rare/40 bg-rare/10 text-rare",
        uncommon: "border-uncommon/40 bg-uncommon/10 text-uncommon",
        alert: "border-alert/40 bg-alert/10 text-alert",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
