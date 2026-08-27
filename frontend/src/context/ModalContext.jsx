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
          iconBg: "bg-[#F4E7EA] text-[#4A0E1C] border-[#E8E3E1]",
          confirmBtn: "bg-[#4A0E1C] hover:bg-[#6B1D2A] text-[#FFFCF7]",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          iconBg: "bg-[#F2DFB0] text-[#A87818] border-[#C99A2E]",
          confirmBtn: "bg-[#C99A2E] hover:bg-[#A87818] text-[#1D1A1B] font-bold",
        };
      case "success":
        return {
          icon: CheckCircle2,
          iconBg: "bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1]",
          confirmBtn: "bg-[#6B1D2A] hover:bg-[#8B3545] text-[#FFFCF7]",
        };
      case "primary":
      default:
        return {
          icon: Info,
          iconBg: "bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1]",
          confirmBtn: "bg-[#6B1D2A] hover:bg-[#8B3545] text-[#FFFCF7]",
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
          className="fixed inset-0 z-[10000] bg-[#1D1A1B]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            className="bg-[#FFFCF7] w-full max-w-md rounded-2xl shadow-2xl border border-[#E8E3E1] p-6 space-y-4 animate-in zoom-in-95 duration-150 relative"
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
                <h3 className="text-base font-bold text-[#1D1A1B] tracking-tight">
                  {modalConfig.title}
                </h3>
                <p className="text-xs text-[#5F5A5C] font-medium leading-relaxed mt-1.5 break-words">
                  {modalConfig.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="text-[#5F5A5C] hover:text-[#1D1A1B] p-1 rounded-lg hover:bg-[#F4E7EA] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E8E3E1]">
              {modalConfig.type === "confirm" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleClose(false)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA]"
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
