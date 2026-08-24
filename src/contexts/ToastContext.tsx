import { AlertCircle, Check, X } from 'lucide-react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastVariant = 'success' | 'error'
type ToastItem = { id: number; message: string; variant: ToastVariant }
type ToastContextValue = { showToast: (message: string, variant?: ToastVariant) => void }

const ToastContext = createContext<ToastContextValue | null>(null)
let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const dismiss = useCallback(
    (id: number) => setToasts((items) => items.filter((item) => item.id !== id)),
    [],
  )

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = ++toastId
      setToasts((items) => [...items, { id, message, variant }])
      window.setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const success = toast.variant === 'success'
          const Icon = success ? Check : AlertCircle
          return (
            <div
              key={toast.id}
              className={`toast-item pointer-events-auto relative overflow-hidden rounded-2xl border bg-white p-4 shadow-xl ${success ? 'border-emerald-100' : 'border-red-100'}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${success ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}
                >
                  <Icon size={17} strokeWidth={2.5} />
                </span>
                <p className="flex-1 pt-1 text-sm font-semibold leading-5 text-[#0F1E2E]">
                  {toast.message}
                </p>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  aria-label="Fechar notificação"
                >
                  <X size={16} />
                </button>
              </div>
              <span
                className={`toast-progress absolute bottom-0 left-0 h-1 ${success ? 'bg-[#10B981]' : 'bg-[#E5484D]'}`}
              />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useLumenToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useLumenToast deve ser usado dentro de ToastProvider')
  return context
}
