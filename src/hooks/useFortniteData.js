import * as React from "react"
import { fetchShop, fetchCosmetics, flattenShopEntries } from "@/lib/fortniteApi"

export function useShop() {
  const [state, setState] = React.useState({ loading: true, error: null, entries: [], raw: null })

  React.useEffect(() => {
    let cancelled = false
    fetchShop()
      .then((data) => {
        if (cancelled) return
        setState({ loading: false, error: null, entries: flattenShopEntries(data), raw: data })
      })
      .catch((err) => {
        if (cancelled) return
        setState({ loading: false, error: err.message, entries: [], raw: null })
      })
    return () => { cancelled = true }
  }, [])

  return state
}

/** All outfit (skin) cosmetics — used to power search/browse outside the current shop. */
export function useAllSkins() {
  const [state, setState] = React.useState({ loading: true, error: null, skins: [] })

  React.useEffect(() => {
    let cancelled = false
    fetchCosmetics()
      .then((data) => {
        if (cancelled) return
        const outfits = (data?.br ?? [])
          .filter((c) => c.type?.value === "outfit")
          .map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            rarity: c.rarity?.value ?? "common",
            rarityDisplay: c.rarity?.displayValue ?? "Common",
            series: c.series?.value ?? null,
            image: c.images?.icon ?? c.images?.smallIcon ?? null,
            added: c.added,
          }))
        setState({ loading: false, error: null, skins: outfits })
      })
      .catch((err) => {
        if (cancelled) return
        setState({ loading: false, error: err.message, skins: [] })
      })
    return () => { cancelled = true }
  }, [])

  return state
}
