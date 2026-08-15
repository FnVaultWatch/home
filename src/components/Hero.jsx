import { CountdownHUD } from "@/components/CountdownHUD"
import { Button } from "@/components/ui/button"
import { Radar } from "lucide-react"

export function Hero({ onGetStarted, onBrowse, stats }) {
  return (
    <section className="relative overflow-hidden border-b border-border-line">
      {/* radar grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 grid-fade opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24">
        <div className="flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-vault-cyan/30 bg-vault-cyan/5 px-3 py-1 text-xs font-medium text-vault-cyan">
            <Radar className="h-3.5 w-3.5" />
            Live item shop tracking
          </div>

          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-mist sm:text-5xl md:text-6xl">
            Know the second your skin is
            <span className="text-gradient"> back in rotation.</span>
          </h1>

          <p className="max-w-xl text-base text-mist-dim md:text-lg">
            VaultWatch scans the Fortnite item shop around the clock. Add a skin to
            your watchlist and we'll flag it the moment it's expected to reappear —
            no more checking the shop every morning.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" onClick={onGetStarted}>Start watching skins</Button>
            <Button size="lg" variant="secondary" onClick={onBrowse}>Browse today's shop</Button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            <CountdownHUD />
            {stats && (
              <div className="flex items-center gap-6 rounded-xl border border-border-line bg-surface/70 px-5 py-3 backdrop-blur-sm">
                <Stat value={stats.itemCount} label="Items in shop" />
                <div className="h-8 w-px bg-border-line" />
                <Stat value={stats.legendaryCount} label="Legendary today" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-lg font-bold text-mist tabular-nums">{value ?? "—"}</p>
      <p className="font-mono text-[11px] uppercase tracking-wider text-mist-dim">{label}</p>
    </div>
  )
}
