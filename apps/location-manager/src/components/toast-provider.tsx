"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastLoader } from "@/components/ui/toast"
import { AnimatePresence, motion } from "framer-motion"

type ToastType = "success" | "error" | "loading"

interface ToastProps {
  id: string
  type: ToastType
  title: string
  description?: string
}

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, "id">) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }])

    if (toast.type !== "loading") {
      setTimeout(() => {
        hideToast(id)
      }, 5000)
    }
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end justify-end p-4 space-y-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <Toast variant={toast.type === "error" ? "destructive" : "default"}>
                <div className="flex items-start gap-2">
                  {toast.type === "loading" && <ToastLoader />}
                  <div>
                    <ToastTitle>{toast.title}</ToastTitle>
                    {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
                  </div>
                </div>
                <ToastClose onClick={() => hideToast(toast.id)} />
              </Toast>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

