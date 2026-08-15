const API_KEY = "25f8443d-62ea-4d57-870e-9d0368d76f22"
const BASE = "https://fortnite-api.com"

async function apiGet(path) {
  const res = await fetch(BASE + path, {
    headers: { Authorization: API_KEY },
  })
  if (!res.ok) {
    throw new Error(`Fortnite API error ${res.status} on ${path}`)
  }
  const json = await res.json()
  return json.data
}

/** Current item shop (v2) — entries grouped as they're displayed in-game. */
export async function fetchShop() {
  return apiGet("/v2/shop")
}

/** All banners (v1). */
export async function fetchBanners() {
  return apiGet("/v1/banners")
}

/**
 * All cosmetics (v2) — large payload. Callers should filter to type
 * "outfit" (skins) client-side and cache the result for the session.
 */
export async function fetchCosmetics() {
  return apiGet("/v2/cosmetics")
}

/** Flattens the v2 shop response into a simple array of shop entries with items. */
export function flattenShopEntries(shopData) {
  if (!shopData) return []
  const entries = shopData.entries ?? []
  return entries.flatMap(entry => {
    const items = entry.brItems ?? entry.items ?? entry.tracks ?? []
    if (!items.length) {
      return [{
        entryId: entry.offerId ?? entry.regularPrice + "-" + entry.devName,
        name: entry.newDisplayAsset?.materialInstances?.[0]?.images?.Background
          ? entry.devName
          : entry.devName,
        items: [],
        price: entry.finalPrice,
        regularPrice: entry.regularPrice,
        rarity: null,
        image: entry.newDisplayAsset?.renderImages?.[0]?.image ?? null,
      }]
    }
    return items.map((it, idx) => ({
      entryId: `${entry.offerId ?? entry.devName}-${idx}`,
      id: it.id,
      name: it.name,
      description: it.description,
      type: it.type?.value,
      rarity: it.rarity?.value ?? "common",
      rarityDisplay: it.rarity?.displayValue ?? "Common",
      series: it.series?.value ?? null,
      image: it.images?.icon ?? it.images?.smallIcon ?? it.images?.featured ?? null,
      price: entry.finalPrice,
      regularPrice: entry.regularPrice,
      inDate: entry.inDate,
      outDate: entry.outDate,
    }))
  })
}
