import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BellRing, ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

const RARITY_VARIANT = {
  legendary: "legendary",
  epic: "epic",
  rare: "rare",
  uncommon: "uncommon",
  common: "outline",
  marvel: "epic",
  dc: "epic",
  starwars: "legendary",
  icon: "rare",
  gaminglegends: "epic",
}

export function SkinCard({ skin, isWatching, onToggleWatch, canWatch, inShopNow = false }) {
  const [imgError, setImgError] = React.useState(false)
  const variant = RARITY_VARIANT[skin.rarity] ?? "outline"

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-surface transition-all duration-200",
        isWatching ? "border-vault-cyan/50 border-glow" : "border-border-line hover:border-vault-cyan/30"
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-surface-2 to-surface">
        {!imgError && skin.image ? (
          <img
            src={skin.image}
            alt={skin.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-mist-dim">
            <ImageOff className="h-10 w-10 opacity-40" />
          </div>
        )}

        {/* Signature: vault scan line sweeps on hover */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-vault-cyan/25 to-transparent animate-scanline" />
        </div>

        {inShopNow && (
          <Badge variant="alert" className="absolute left-2 top-2">In shop now</Badge>
        )}
        <Badge variant={variant} className="absolute right-2 top-2">
          {skin.rarityDisplay ?? skin.rarity}
        </Badge>
      </div>

      <div className="p-3.5">
        <p className="truncate font-display text-sm font-semibold text-mist" title={skin.name}>
          {skin.name}
        </p>
        {skin.price != null && (
          <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-mist-dim">
            <span className="text-legendary">V-Bucks</span> {skin.price.toLocaleString()}
          </p>
        )}
        {skin.series && (
          <p className="mt-0.5 truncate text-[11px] text-mist-dim">{skin.series} Series</p>
        )}

        {canWatch && (
          <Button
            variant={isWatching ? "default" : "secondary"}
            size="sm"
            className="mt-3 w-full"
            onClick={() => onToggleWatch(skin.id)}
          >
            {isWatching ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            {isWatching ? "Watching" : "Notify me"}
          </Button>
        )}
      </div>
    </div>
  )
}
