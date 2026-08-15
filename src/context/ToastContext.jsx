import * as React from "react"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const dismiss = React.useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }, [])

  const toast = React.useCallback(({ title, description, variant = "default" }) => {
    const id = ++idCounter
    setToasts((t) => [...t, { id, title, description, variant }])
    setTimeout(() => dismiss(id), 4500)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-200",
              t.variant === "success" && "border-uncommon/40 bg-surface-2/95",
              t.variant === "error" && "border-alert/40 bg-surface-2/95",
              t.variant === "default" && "border-border-line bg-surface-2/95"
            )}
          >
            {t.variant === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-uncommon" />}
            {t.variant === "error" && <XCircle className="h-5 w-5 shrink-0 text-alert" />}
            {t.variant === "default" && <Info className="h-5 w-5 shrink-0 text-vault-cyan" />}
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-semibold text-mist">{t.title}</p>}
              {t.description && <p className="text-xs text-mist-dim mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-mist-dim hover:text-mist"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
