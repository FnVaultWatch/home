import * as React from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Radar, LogOut, User } from "lucide-react"

export function Navbar({ onOpenAuth, view, onNavigate }) {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border-line bg-void/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-mist"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-vault-cyan to-vault-violet">
            <Radar className="h-4.5 w-4.5 text-void" strokeWidth={2.5} />
          </span>
          Vault<span className="text-gradient">Watch</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink active={view === "home"} onClick={() => onNavigate("home")}>Shop</NavLink>
          <NavLink active={view === "browse"} onClick={() => onNavigate("browse")}>Browse skins</NavLink>
          {user && (
            <NavLink active={view === "watchlist"} onClick={() => onNavigate("watchlist")}>My watchlist</NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-border-line bg-surface px-3 py-1.5 text-xs font-medium text-mist sm:flex">
                <User className="h-3.5 w-3.5 text-vault-cyan" />
                {user.username}
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => onOpenAuth("signin")}>Sign in</Button>
              <Button size="sm" onClick={() => onOpenAuth("signup")}>Get notified</Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
        active ? "text-mist bg-surface" : "text-mist-dim hover:text-mist"
      }`}
    >
      {children}
    </button>
  )
}
