import * as React from "react"

function getNextRotation() {
  const now = new Date()
  const next = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0
  ))
  return next
}

export function useShopCountdown() {
  const [remaining, setRemaining] = React.useState(() => getNextRotation() - new Date())

  React.useEffect(() => {
    const interval = setInterval(() => {
      const diff = getNextRotation() - new Date()
      setRemaining(diff > 0 ? diff : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const totalSeconds = Math.max(0, Math.floor(remaining / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  }
}
