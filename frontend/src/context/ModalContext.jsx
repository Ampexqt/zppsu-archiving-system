import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback(
    ({
      title = "Confirm Action",
      message = "Are you sure you want to proceed?",
      confirmText = "Confirm",
      cancelText = "Cancel",
      variant = "primary", // "primary" | "danger" | "warning" | "success"
    }) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setModalConfig({
          type: "confirm",
          title,
          message,
          confirmText,
          cancelText,
          variant,
        });
      });
    },
    []
  );

  const alertModal = useCallback(
    ({
      title = "System Notification",
      message = "",
      confirmText = "Understood",
      variant = "primary",
    }) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setModalConfig({
          type: "alert",
          title,
          message,
          confirmText,
          variant,
        });
      });
    },
    []
  );

  const handleClose = (result) => {
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
    setModalConfig(null);
  };

  const getVariantStyles = (variant) => {
    switch (variant) {
      case "danger":
        return {
          icon: AlertCircle,
          iconBg: "bg-red-50 text-red-700 border-red-200",
          confirmBtn: "bg-red-700 hover:bg-red-800 text-white",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          iconBg: "bg-amber-50 text-amber-700 border-amber-200",
          confirmBtn: "bg-[#FFD700] hover:bg-[#E6C200] text-gray-900 font-bold",
        };
      case "success":
        return {
          icon: CheckCircle2,
          iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          confirmBtn: "bg-emerald-700 hover:bg-emerald-800 text-white",
        };
      case "primary":
      default:
        return {
          icon: Info,
          iconBg: "bg-[#800000]/10 text-[#800000] border-[#800000]/20",
          confirmBtn: "bg-[#800000] hover:bg-[#660000] text-white",
        };
    }
  };

  return (
    <ModalContext.Provider value={{ confirm, alert: alertModal }}>
      {children}

      {/* CONFIRMATION / ALERT MODAL BACKDROP */}
      {modalConfig && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-in zoom-in-95 duration-150 relative"
            onKeyDown={(e) => {
              if (e.key === "Escape") handleClose(false);
            }}
          >
            <div className="flex items-start gap-3.5">
              {(() => {
                const style = getVariantStyles(modalConfig.variant);
                const Icon = style.icon;
                return (
                  <div className={`p-2 rounded-xl border shrink-0 ${style.iconBg}`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  {modalConfig.title}
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1.5 break-words">
                  {modalConfig.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              {modalConfig.type === "confirm" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(false)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-gray-700 bg-white border-gray-200"
                >
                  {modalConfig.cancelText}
                </Button>
              )}
              {(() => {
                const style = getVariantStyles(modalConfig.variant);
                return (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleClose(true)}
                    className={`h-9 px-4 rounded-xl text-xs font-bold shadow-xs ${style.confirmBtn}`}
                    autoFocus
                  >
                    {modalConfig.confirmText}
                  </Button>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
