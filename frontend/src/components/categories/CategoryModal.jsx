import React, { useState, useEffect } from "react";
import { X, Tags, Check, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * CategoryModal
 * Reusable modal for creating or editing document classification categories.
 * Features institutional suggestions, validation, and accessible keyboard dismissal.
 */
export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialName = "",
  isEdit = false,
  isSaving = false,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(initialName || "");
  }, [initialName, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSaving) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!name.trim() || isSaving) return;
    onSave(name.trim());
  };

  const sampleSuggestions = [
    "Academic Records",
    "Guidance Counseling",
    "Administrative Orders",
    "Financial Audits",
    "Faculty Portfolios",
    "Board Resolutions",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1D1A1B]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="bg-[#FFFCF7] w-full max-w-md rounded-2xl shadow-xl border border-[#E8E3E1] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 px-6 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shrink-0">
              <Tags className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1D1A1B] text-sm tracking-tight">
                {isEdit ? "Edit Classification Category" : "New Document Classification"}
              </h3>
              <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                {isEdit ? "Update classification category title" : "Add a standardized classification for records"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1A1B] flex items-center justify-between">
              <span>Category Title <strong className="text-[#6B1D2A]">*</strong></span>
              <span className="text-[10px] text-[#5F5A5C] font-normal">e.g. Guidance Counseling Notes</span>
            </label>
            <Input
              type="text"
              placeholder="Enter category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
            />
          </div>

          {/* QUICK SUGGESTIONS (FOR NEW CATEGORIES) */}
          {!isEdit && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                Suggested Classifications
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setName(suggestion)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#FFFCF7] border border-[#E8E3E1] text-[#1D1A1B] hover:border-[#6B1D2A] hover:bg-[#F4E7EA]/40 transition-all cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8E3E1] flex items-center justify-end gap-2.5 bg-[#FFFCF7]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!name.trim() || isSaving}
            className="h-9 px-4 rounded-xl text-xs font-bold text-[#FFFCF7] bg-[#6B1D2A] hover:bg-[#8B3545] cursor-pointer shadow-xs inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {isEdit ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
