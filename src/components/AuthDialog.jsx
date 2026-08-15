import * as React from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PasswordStrength } from "@/components/PasswordStrength"
import { validatePassword } from "@/lib/password"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"

export function AuthDialog({ open, onOpenChange, defaultTab = "signup" }) {
  const [tab, setTab] = React.useState(defaultTab)
  React.useEffect(() => { if (open) setTab(defaultTab) }, [open, defaultTab])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tab === "signup" ? "Create your watch account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {tab === "signup"
              ? "Track skins and get notified the moment they're expected back in the shop."
              : "Sign in to manage your skin watchlist."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign up</TabsTrigger>
            <TabsTrigger value="signin">Sign in</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <SignUpForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="signin">
            <SignInForm onSuccess={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function SignUpForm({ onSuccess }) {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [showPw, setShowPw] = React.useState(false)
  const [errors, setErrors] = React.useState([])
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors([])

    const nextErrors = []
    if (username.trim().length < 3) {
      nextErrors.push("Username must be at least 3 characters.")
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      nextErrors.push("Username can only contain letters, numbers, and underscores.")
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.push("Enter a valid email address.")
    }
    const pwCheck = validatePassword(password, { username, email })
    if (!pwCheck.valid) nextErrors.push(...pwCheck.errors)
    if (password !== confirm) nextErrors.push("Passwords don't match.")

    if (nextErrors.length) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    try {
      await signUp({ username, email, password })
      toast({ title: "Account created", description: `Welcome, ${username}. Start watching skins below.`, variant: "success" })
      onSuccess?.()
    } catch (err) {
      setErrors([err.message])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="su-username">Username</Label>
        <Input id="su-username" autoComplete="username" placeholder="LlamaHunter99"
          value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="su-email">Email</Label>
        <Input id="su-email" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="su-password">Password</Label>
        <div className="relative">
          <Input id="su-password" type={showPw ? "text" : "password"} autoComplete="new-password"
            placeholder="8+ characters, mix it up"
            value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
          <button type="button" onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-dim hover:text-mist"
            aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrength password={password} />
      </div>
      <div>
        <Label htmlFor="su-confirm">Confirm password</Label>
        <Input id="su-confirm" type={showPw ? "text" : "password"} autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>

      <div className="flex items-start gap-2 rounded-md border border-border-line bg-surface-2/60 p-3">
        <ShieldCheck className="h-4 w-4 shrink-0 text-vault-cyan mt-0.5" />
        <p className="text-[11px] leading-relaxed text-mist-dim">
          Passwords need 8+ characters and a mix of letters, numbers, or symbols — the same
          minimum bar Google applies when you create an account. We hash it locally before
          it's ever stored.
        </p>
      </div>

      {errors.length > 0 && (
        <ul className="space-y-1 rounded-md border border-alert/30 bg-alert/10 p-3 text-xs text-alert">
          {errors.map((err, i) => <li key={i}>• {err}</li>)}
        </ul>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}

function SignInForm({ onSuccess }) {
  const { signIn } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPw, setShowPw] = React.useState(false)
  const [error, setError] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const user = await signIn({ email, password })
      toast({ title: `Welcome back, ${user.username}`, variant: "success" })
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="si-email">Email</Label>
        <Input id="si-email" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="si-password">Password</Label>
        <div className="relative">
          <Input id="si-password" type={showPw ? "text" : "password"} autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
          <button type="button" onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-dim hover:text-mist"
            aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {error && (
        <p className="rounded-md border border-alert/30 bg-alert/10 p-3 text-xs text-alert">{error}</p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
