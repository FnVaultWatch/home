import { useShopCountdown } from "@/hooks/useShopCountdown"

export function CountdownHUD() {
  const { hours, minutes, seconds } = useShopCountdown()

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-border-line bg-surface/70 px-5 py-3 backdrop-blur-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vault-cyan opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-vault-cyan" />
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-mist-dim">
        Next rotation in
      </span>
      <div className="flex items-baseline gap-1 font-display font-bold text-mist">
        <TimeUnit value={hours} label="h" />
        <span className="text-mist-dim">:</span>
        <TimeUnit value={minutes} label="m" />
        <span className="text-mist-dim">:</span>
        <TimeUnit value={seconds} label="s" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }) {
  return (
    <span className="tabular-nums text-lg text-gradient">
      {value}<span className="ml-0.5 text-xs font-normal text-mist-dim">{label}</span>
    </span>
  )
}
