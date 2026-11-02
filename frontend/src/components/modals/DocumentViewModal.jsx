import React, { useEffect } from "react";
import { X, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentTemplateRenderer from "../templates/DocumentTemplateRenderer";

/**
 * DocumentViewModal
 * Redesigned full-screen preview modal for official university documents.
 * Integrates DocumentTemplateRenderer, metadata strip, and print utilities.
 */
export default function DocumentViewModal({
  isOpen,
  file,
  onClose,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  const documentIdentifier = file.document_id || file.access_code || `DOC-${file.id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1D1A1B]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
    >
      <div
        className="bg-[#FFFCF7] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8E3E1] flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 px-6 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-[#1D1A1B] text-sm tracking-tight truncate">
                  {file.subject || file.title || "Document Viewer"}
                </h3>
                <span className="font-mono text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA]/60 border border-[#E8E3E1] px-1.5 py-0.5 rounded shrink-0">
                  {documentIdentifier}
                </span>
              </div>
              <p className="text-[11px] text-[#5F5A5C] truncate mt-0.5">
                {file.document_type || "Official Record"} &bull; Category: {file.category || "General"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-2.5 rounded-lg text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer inline-flex items-center gap-1.5"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5 text-[#5F5A5C]" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-lg transition-colors cursor-pointer"
              aria-label="Close document viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL BODY WITH TEMPLATE RENDERER */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#FCFAF8]/40">
          <DocumentTemplateRenderer document={file} />
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 px-6 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] shrink-0 text-xs">
          <div className="flex items-center gap-4 text-[#5F5A5C] text-[11px]">
            <span>
              Status: <strong className="text-[#1D1A1B]">{file.status || "Active"}</strong>
            </span>
            {file.file_box?.cabinet?.name && (
              <span className="hidden sm:inline">
                Storage: <strong className="text-[#1D1A1B]">{file.file_box.cabinet.name} &rarr; {file.file_box.name}</strong>
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 px-4 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
