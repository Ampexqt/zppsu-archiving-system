import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, title, type = "info", duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newToast = { id, message, title, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (message, title) => addToast({ message, title: title || "Success", type: "success" }),
    error: (message, title) => addToast({ message, title: title || "Error", type: "error" }),
    warning: (message, title) => addToast({ message, title: title || "Notice", type: "warning" }),
    info: (message, title) => addToast({ message, title: title || "Information", type: "info" }),
  };

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          border: "border-emerald-200",
          bg: "bg-white",
          iconColor: "text-emerald-700 bg-emerald-50",
          icon: CheckCircle2,
          barColor: "bg-emerald-600",
        };
      case "error":
        return {
          border: "border-red-200",
          bg: "bg-white",
          iconColor: "text-red-700 bg-red-50",
          icon: AlertCircle,
          barColor: "bg-[#800000]",
        };
      case "warning":
        return {
          border: "border-amber-200",
          bg: "bg-white",
          iconColor: "text-amber-700 bg-amber-50",
          icon: AlertTriangle,
          barColor: "bg-[#FFD700]",
        };
      case "info":
      default:
        return {
          border: "border-gray-200",
          bg: "bg-white",
          iconColor: "text-[#800000] bg-[#800000]/10",
          icon: Info,
          barColor: "bg-[#800000]",
        };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* TOAST CONTAINER */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const style = getToastStyles(t.type);
          const Icon = style.icon;

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${style.border} ${style.bg} shadow-lg transition-all transform animate-in slide-in-from-top-3 fade-in duration-200 overflow-hidden relative`}
              role="alert"
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${style.iconColor}`}>
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                {t.title && (
                  <h4 className="text-xs font-bold text-gray-900 tracking-tight">{t.title}</h4>
                )}
                <p className="text-xs text-gray-600 font-medium leading-relaxed mt-0.5 break-words">
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
