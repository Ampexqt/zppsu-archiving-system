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
          border: "border-[#E8E3E1]",
          bg: "bg-[#FFFCF7]",
          iconColor: "text-[#6B1D2A] bg-[#F4E7EA]",
          icon: CheckCircle2,
          barColor: "bg-[#6B1D2A]",
        };
      case "error":
        return {
          border: "border-[#E8E3E1]",
          bg: "bg-[#FFFCF7]",
          iconColor: "text-[#4A0E1C] bg-[#F4E7EA]",
          icon: AlertCircle,
          barColor: "bg-[#4A0E1C]",
        };
      case "warning":
        return {
          border: "border-[#C99A2E]",
          bg: "bg-[#FFFCF7]",
          iconColor: "text-[#A87818] bg-[#F2DFB0]",
          icon: AlertTriangle,
          barColor: "bg-[#C99A2E]",
        };
      case "info":
      default:
        return {
          border: "border-[#E8E3E1]",
          bg: "bg-[#FFFCF7]",
          iconColor: "text-[#6B1D2A] bg-[#F4E7EA]",
          icon: Info,
          barColor: "bg-[#6B1D2A]",
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
                  <h4 className="text-xs font-bold text-[#1D1A1B] tracking-tight">{t.title}</h4>
                )}
                <p className="text-xs text-[#5F5A5C] font-medium leading-relaxed mt-0.5 break-words">
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-lg transition-colors"
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
