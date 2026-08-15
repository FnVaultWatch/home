import * as React from "react"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { ToastProvider } from "@/context/ToastContext"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AuthDialog } from "@/components/AuthDialog"
import { HomePage } from "@/pages/HomePage"
import { BrowsePage } from "@/pages/BrowsePage"
import { WatchlistPage } from "@/pages/WatchlistPage"
import { reportPageLoad } from "@/lib/authStore"

function AppShell() {
  const { user } = useAuth()
  const [view, setView] = React.useState("home")
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authTab, setAuthTab] = React.useState("signup")

  function openAuth(tab = "signup") {
    setAuthTab(tab)
    setAuthOpen(true)
  }

  function navigate(next) {
    if (next === "watchlist" && !user) {
      openAuth("signup")
      return
    }
    setView(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onOpenAuth={openAuth} view={view} onNavigate={navigate} />

      <main className="flex-1">
        {view === "home" && (
          <HomePage onRequireAuth={() => openAuth("signup")} onNavigate={navigate} />
        )}
        {view === "browse" && (
          <BrowsePage onRequireAuth={() => openAuth("signup")} />
        )}
        {view === "watchlist" && user && <WatchlistPage />}
      </main>

      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </div>
  )
}

export default function App() {
  React.useEffect(() => {
    reportPageLoad()
  }, [])

  return (
    <ToastProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ToastProvider>
  )
}
