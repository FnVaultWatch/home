import { Radar } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border-line">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2 font-display font-bold text-mist">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-vault-cyan to-vault-violet">
              <Radar className="h-3.5 w-3.5 text-void" strokeWidth={2.5} />
            </span>
            Vault<span className="text-gradient">Watch</span>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-mist-dim">
            VaultWatch is a fan-made tracking tool and isn't endorsed by or affiliated with
            Epic Games. Item shop data is provided by Fortnite-API.com. Fortnite is a
            trademark of Epic Games, Inc.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-border-line pt-6 text-[11px] text-mist-dim md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} VaultWatch. Built for the community.</span>
          <span>Shop data refreshes on each daily rotation, 00:00 UTC.</span>
        </div>
      </div>
    </footer>
  )
}
