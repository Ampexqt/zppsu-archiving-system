import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-md", // "max-w-sm" | "max-w-md" | "max-w-lg" | "max-w-2xl" | "max-w-4xl"
  showClose = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className={`bg-white w-full ${maxWidth} rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150`}
      >
        {/* HEADER */}
        {(title || showClose) && (
          <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-[#FDFBF7]">
            <div>
              {title && <h3 className="text-base font-bold text-gray-900">{title}</h3>}
              {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* FOOTER */}
        {footer && (
          <div className="p-4 px-6 border-t border-gray-100 flex items-center justify-end gap-2 bg-[#FDFBF7]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
