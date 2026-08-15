import * as React from "react"
import { Hero } from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks"
import { ShopSection } from "@/components/ShopSection"

export function HomePage({ onRequireAuth, onNavigate }) {
  const [stats, setStats] = React.useState(null)
  const handleStatsReady = React.useCallback((s) => setStats(s), [])

  return (
    <div>
      <Hero
        stats={stats}
        onGetStarted={onRequireAuth}
        onBrowse={() => onNavigate("browse")}
      />
      <HowItWorks />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <ShopSection onRequireAuth={onRequireAuth} onStatsReady={handleStatsReady} />
      </div>
    </div>
  )
}
