"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

let toastQueue: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

export const toast = {
  success: (message: string, duration = 3000) => {
    addToast({ id: Date.now().toString(), type: "success", message, duration })
  },
  error: (message: string, duration = 5000) => {
    addToast({ id: Date.now().toString(), type: "error", message, duration })
  },
  warning: (message: string, duration = 4000) => {
    addToast({ id: Date.now().toString(), type: "warning", message, duration })
  },
  info: (message: string, duration = 3000) => {
    addToast({ id: Date.now().toString(), type: "info", message, duration })
  },
}

function addToast(newToast: Toast) {
  toastQueue = [...toastQueue, newToast]
  notifyListeners()
}

function removeToast(id: string) {
  toastQueue = toastQueue.filter((t) => t.id !== id)
  notifyListeners()
}

function notifyListeners() {
  listeners.forEach((listener) => listener([...toastQueue]))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
        return () => clearTimeout(timer)
      }
    })
  }, [toasts])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "error":
        return <XCircle className="w-5 h-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5" />
      case "info":
        return <Info className="w-5 h-5" />
    }
  }

  const getColors = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400"
      case "error":
        return "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
      case "info":
        return "bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg min-w-[300px] max-w-[450px] ${getColors(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

