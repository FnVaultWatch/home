import * as React from "react"
import * as authStore from "@/lib/authStore"

const AuthContext = React.createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => authStore.getCurrentUser())

  const signUp = React.useCallback(async (payload) => {
    const u = await authStore.signUp(payload)
    setUser(u)
    return u
  }, [])

  const signIn = React.useCallback(async (payload) => {
    const u = await authStore.signIn(payload)
    setUser(u)
    return u
  }, [])

  const signOut = React.useCallback(() => {
    authStore.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
