import { scorePassword } from "@/lib/password"
import { cn } from "@/lib/utils"

const COLORS = [
  "bg-border-line",
  "bg-alert",
  "bg-alert",
  "bg-legendary",
  "bg-uncommon",
  "bg-vault-cyan",
]

export function PasswordStrength({ password }) {
  const { score, label } = scorePassword(password)
  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-200",
              i < score ? COLORS[score] : "bg-border-line"
            )}
          />
        ))}
      </div>
      <p className="mt-1 text-[11px] font-mono text-mist-dim">{label}</p>
    </div>
  )
}
