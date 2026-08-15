import * as React from "react"
import { SkinCard } from "@/components/SkinCard"
import { SkinGridSkeleton } from "@/components/SkinGridSkeleton"
import { SearchBar } from "@/components/SearchBar"
import { useShop } from "@/hooks/useFortniteData"
import { useAuth } from "@/context/AuthContext"
import { useWatchlist } from "@/hooks/useWatchlist"
import { useToast } from "@/context/ToastContext"
import { AlertTriangle } from "lucide-react"

export function ShopSection({ onRequireAuth, onStatsReady }) {
  const { loading, error, entries } = useShop()
  const { user } = useAuth()
  const { isWatching, toggle } = useWatchlist()
  const { toast } = useToast()
  const [query, setQuery] = React.useState("")

  const skinEntries = React.useMemo(
    () => entries.filter((e) => e.type === "outfit" || (!e.type && e.image)),
    [entries]
  )

  React.useEffect(() => {
    if (!loading && !error && onStatsReady) {
      onStatsReady({
        itemCount: entries.length,
        legendaryCount: entries.filter((e) => e.rarity === "legendary").length,
      })
    }
  }, [loading, error, entries, onStatsReady])

  const filtered = React.useMemo(() => {
    if (!query.trim()) return skinEntries
    const q = query.toLowerCase()
    return skinEntries.filter((s) => s.name?.toLowerCase().includes(q))
  }, [skinEntries, query])

  function handleToggle(id) {
    if (!user) {
      onRequireAuth()
      return
    }
    const next = toggle(id)
    const nowWatching = next?.includes(id)
    toast({
      title: nowWatching ? "Added to watchlist" : "Removed from watchlist",
      variant: "success",
    })
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-alert/30 bg-alert/5 p-10 text-center">
        <AlertTriangle className="h-8 w-8 text-alert" />
        <p className="font-display text-lg font-semibold text-mist">Couldn't load today's shop</p>
        <p className="max-w-md text-sm text-mist-dim">
          {error}. The Fortnite-API service may be temporarily unavailable, or this network
          may be blocking requests to fortnite-api.com.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-mist">Today's item shop</h2>
          <p className="text-sm text-mist-dim">
            {loading ? "Scanning the shop..." : `${filtered.length} skins currently featured`}
          </p>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search today's shop..." />
      </div>

      {loading ? (
        <SkinGridSkeleton count={10} />
      ) : filtered.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((skin) => (
            <SkinCard
              key={skin.entryId}
              skin={skin}
              isWatching={isWatching(skin.id)}
              onToggleWatch={handleToggle}
              canWatch
              inShopNow
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ query }) {
  return (
    <div className="rounded-xl border border-dashed border-border-line p-12 text-center">
      <p className="font-display text-lg font-semibold text-mist">No matches in today's shop</p>
      <p className="mt-1 text-sm text-mist-dim">
        {query ? `Nothing matches "${query}" right now.` : "Check back after the next rotation."}
      </p>
    </div>
  )
}
