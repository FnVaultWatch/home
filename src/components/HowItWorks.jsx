import { Search, BellPlus, Radar } from "lucide-react"

const STEPS = [
  {
    icon: Search,
    title: "Find your skin",
    body: "Search the full cosmetics catalog or browse today's live shop for the outfit you're after.",
  },
  {
    icon: BellPlus,
    title: "Add it to your watchlist",
    body: "One tap saves it to your account. Watch as many skins as you want — there's no limit.",
  },
  {
    icon: Radar,
    title: "Get flagged when it returns",
    body: "VaultWatch checks the shop on every rotation and highlights your watched skins the moment they're back.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-b border-border-line bg-surface/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-2xl font-bold text-mist md:text-3xl">How VaultWatch works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-xl border border-border-line bg-surface p-6">
              <span className="font-mono text-xs text-mist-dim">0{i + 1}</span>
              <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-vault-cyan/15 to-vault-violet/15 border border-vault-cyan/20">
                <step.icon className="h-5 w-5 text-vault-cyan" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-mist">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mist-dim">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
