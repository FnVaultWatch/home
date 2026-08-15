import * as React from "react"
import * as authStore from "@/lib/authStore"
import { useAuth } from "@/context/AuthContext"

export function useWatchlist() {
  const { user } = useAuth()
  const [watchlist, setWatchlistState] = React.useState(() =>
    user ? authStore.getWatchlist(user.email) : []
  )

  React.useEffect(() => {
    setWatchlistState(user ? authStore.getWatchlist(user.email) : [])
  }, [user])

  const toggle = React.useCallback((itemId) => {
    if (!user) return null
    const next = authStore.toggleWatch(user.email, itemId)
    setWatchlistState(next)
    return next
  }, [user])

  const isWatching = React.useCallback((itemId) => watchlist.includes(itemId), [watchlist])

  return { watchlist, toggle, isWatching }
}
