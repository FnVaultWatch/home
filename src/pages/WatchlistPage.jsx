import * as React from "react"
import { useAllSkins, useShop } from "@/hooks/useFortniteData"
import { useWatchlist } from "@/hooks/useWatchlist"
import { useAuth } from "@/context/AuthContext"
import { SkinCard } from "@/components/SkinCard"
import { SkinGridSkeleton } from "@/components/SkinGridSkeleton"
import { Badge } from "@/components/ui/badge"
import { BellRing, Sparkles } from "lucide-react"

export function WatchlistPage() {
  const { user } = useAuth()
  const { loading, skins } = useAllSkins()
  const { entries: shopEntries } = useShop()
  const { watchlist, toggle } = useWatchlist()

  const shopIds = React.useMemo(() => new Set(shopEntries.map((e) => e.id)), [shopEntries])

  const watchedSkins = React.useMemo(
    () => skins.filter((s) => watchlist.includes(s.id)),
    [skins, watchlist]
  )
  const readyNow = watchedSkins.filter((s) => shopIds.has(s.id))
  const stillWaiting = watchedSkins.filter((s) => !shopIds.has(s.id))

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-2">
        <h1 className="font-display text-3xl font-bold text-mist">Hey, {user?.username}</h1>
        <p className="mt-1 text-sm text-mist-dim">
          You're watching {watchlist.length} {watchlist.length === 1 ? "skin" : "skins"}.
          We'll flag anything that's back in rotation right here.
        </p>
      </div>

      {loading ? (
        <div className="mt-8"><SkinGridSkeleton count={5} /></div>
      ) : watchlist.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border-line p-14 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-mist-dim" />
          <p className="mt-3 font-display text-lg font-semibold text-mist">Your watchlist is empty</p>
          <p className="mt-1 text-sm text-mist-dim">
            Head to "Browse skins" or "Shop" and tap "Notify me" on anything you want back.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {readyNow.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <BellRing className="h-5 w-5 text-vault-cyan" />
                <h2 className="font-display text-xl font-bold text-mist">Back in the shop today</h2>
                <Badge variant="alert">{readyNow.length}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {readyNow.map((skin) => (
                  <SkinCard
                    key={skin.id}
                    skin={skin}
                    isWatching
                    onToggleWatch={toggle}
                    canWatch
                    inShopNow
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 font-display text-xl font-bold text-mist">
              Still watching {stillWaiting.length > 0 && `(${stillWaiting.length})`}
            </h2>
            {stillWaiting.length === 0 ? (
              <p className="text-sm text-mist-dim">Every watched skin is currently in the shop.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {stillWaiting.map((skin) => (
                  <SkinCard
                    key={skin.id}
                    skin={skin}
                    isWatching
                    onToggleWatch={toggle}
                    canWatch
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
