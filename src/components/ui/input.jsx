import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-border-line bg-surface px-3.5 py-2 text-sm text-mist placeholder:text-mist-dim/70 transition-colors focus-visible:outline-none focus-visible:border-vault-cyan/70 focus-visible:ring-1 focus-visible:ring-vault-cyan/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
