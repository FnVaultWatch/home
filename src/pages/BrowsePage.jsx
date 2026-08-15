import * as React from "react"
import { useAllSkins } from "@/hooks/useFortniteData"
import { useAuth } from "@/context/AuthContext"
import { useWatchlist } from "@/hooks/useWatchlist"
import { useToast } from "@/context/ToastContext"
import { SkinCard } from "@/components/SkinCard"
import { SkinGridSkeleton } from "@/components/SkinGridSkeleton"
import { SearchBar } from "@/components/SearchBar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"

const RARITIES = ["all", "legendary", "epic", "rare", "uncommon", "common", "icon", "marvel", "dc", "starwars", "gaminglegends"]

export function BrowsePage({ onRequireAuth }) {
  const { loading, error, skins } = useAllSkins()
  const { user } = useAuth()
  const { isWatching, toggle } = useWatchlist()
  const { toast } = useToast()
  const [query, setQuery] = React.useState("")
  const [rarity, setRarity] = React.useState("all")
  const [visibleCount, setVisibleCount] = React.useState(30)

  const filtered = React.useMemo(() => {
    let list = skins
    if (rarity !== "all") list = list.filter((s) => s.rarity === rarity)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((s) => s.name?.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => (b.added ?? "").localeCompare(a.added ?? ""))
  }, [skins, rarity, query])

  function handleToggle(id) {
    if (!user) {
      onRequireAuth()
      return
    }
    const next = toggle(id)
    toast({
      title: next?.includes(id) ? "Added to watchlist" : "Removed from watchlist",
      variant: "success",
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-2 flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-mist">Browse every skin</h1>
        <p className="text-sm text-mist-dim">
          Search the full cosmetics catalog and watch any skin, not just what's in the shop today.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search all skins..." />
        <Select value={rarity} onValueChange={setRarity}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            {RARITIES.map((r) => (
              <SelectItem key={r} value={r}>{r === "all" ? "All rarities" : r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!loading && !error && (
          <p className="whitespace-nowrap text-xs text-mist-dim sm:ml-auto">
            {filtered.length.toLocaleString()} results
          </p>
        )}
      </div>

      <div className="mt-8">
        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-alert/30 bg-alert/5 p-10 text-center">
            <AlertTriangle className="h-8 w-8 text-alert" />
            <p className="font-display text-lg font-semibold text-mist">Couldn't load the catalog</p>
            <p className="max-w-md text-sm text-mist-dim">{error}</p>
          </div>
        ) : loading ? (
          <SkinGridSkeleton count={15} />
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-line p-12 text-center">
            <p className="font-display text-lg font-semibold text-mist">No skins match</p>
            <p className="mt-1 text-sm text-mist-dim">Try a different search term or rarity.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.slice(0, visibleCount).map((skin) => (
                <SkinCard
                  key={skin.id}
                  skin={skin}
                  isWatching={isWatching(skin.id)}
                  onToggleWatch={handleToggle}
                  canWatch
                />
              ))}
            </div>
            {visibleCount < filtered.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 30)}
                  className="rounded-md border border-border-line bg-surface px-6 py-2.5 text-sm font-semibold text-mist hover:border-vault-cyan/50"
                >
                  Load more skins
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
