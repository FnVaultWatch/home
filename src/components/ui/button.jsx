import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-wide transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-void",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-vault-cyan to-vault-violet text-void shadow-[0_0_20px_-4px_rgba(0,229,255,0.5)] hover:shadow-[0_0_28px_-4px_rgba(123,47,247,0.65)] hover:brightness-110",
        secondary:
          "bg-surface-2 text-mist border border-border-line hover:border-vault-cyan/50 hover:bg-surface-2/80",
        outline:
          "border border-border-line bg-transparent text-mist hover:border-vault-cyan/60 hover:bg-surface/50",
        ghost: "text-mist-dim hover:text-mist hover:bg-surface/60",
        destructive: "bg-alert text-white hover:bg-alert/90",
        link: "text-vault-cyan underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
