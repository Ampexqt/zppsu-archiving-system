import React, { useState, useEffect } from "react";
import { X, FileEdit, Box, Check, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import PhysicalStoragePlacementCard from "../files/PhysicalStoragePlacementCard";

/**
 * DocumentEditModal
 * Redesigned modal for editing document metadata and assigning physical storage location.
 * Adheres strictly to the 11-color palette and shadcn/ui design standards.
 */
export default function DocumentEditModal({
  isOpen,
  file,
  cabinets = [],
  onClose,
  onSave,
  isSaving = false,
}) {
  const [subject, setSubject] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [status, setStatus] = useState("Active");
  const [cabinetId, setCabinetId] = useState("");
  const [fileBoxId, setFileBoxId] = useState("");

  // Sync state whenever file changes
  useEffect(() => {
    if (file) {
      setSubject(file.subject || file.title || "");
      setDocumentType(file.document_type || "General Document");
      setStatus(file.status || "Active");
      setCabinetId(file.file_box?.cabinet?.id ? String(file.file_box.cabinet.id) : "");
      setFileBoxId(file.file_box_id ? String(file.file_box_id) : "");
    }
  }, [file]);

  // Handle escape key
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

  if (!isOpen || !file) return null;

  // Selected cabinet and available file boxes
  const selectedCabinet = cabinets.find((c) => String(c.id) === String(cabinetId));
  const availableBoxes = selectedCabinet?.file_boxes || [];
  const selectedBox = availableBoxes.find((b) => String(b.id) === String(fileBoxId));

  const handleCabinetChange = (val) => {
    setCabinetId(val);
    // If cabinet changed or cleared, reset the selected file box
    setFileBoxId("");
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isSaving) return;
    onSave({
      subject,
      document_type: documentType,
      status,
      cabinet_id: cabinetId,
      file_box_id: fileBoxId,
    });
  };

  const documentIdentifier = file.document_id || file.access_code || `DOC-${file.id}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1D1A1B]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="bg-[#FFFCF7] w-full max-w-lg rounded-2xl shadow-xl border border-[#E8E3E1] flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 px-6 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shrink-0">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1D1A1B] text-sm tracking-tight">
                Edit Record & Storage Location
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-[#5F5A5C]">Record ID:</span>
                <span className="font-mono text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA]/60 border border-[#E8E3E1] px-1.5 py-0.5 rounded">
                  {documentIdentifier}
                </span>
              </div>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* SECTION 1: METADATA */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-1.5">
              <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider">
                Document Details
              </span>
              <span className="text-[10px] text-[#5F5A5C]">General Metadata</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1A1B]">
                Subject / Document Title <span className="text-[#6B1D2A]">*</span>
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter document subject or title..."
                required
                className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* DOCUMENT TYPE (LOCKED) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1D1A1B]">
                    Document Type
                  </label>
                  <span className="text-[10px] text-[#5F5A5C] inline-flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5 text-[#5F5A5C]" />
                    Template Locked
                  </span>
                </div>
                <Input
                  type="text"
                  value={documentType}
                  disabled
                  className="h-10 text-xs rounded-xl bg-[#E8E3E1]/40 border-[#E8E3E1] text-[#5F5A5C] cursor-not-allowed font-medium"
                />
              </div>

              {/* RECORD STATUS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1A1B]">
                  Record Status
                </label>
                <ShadcnSelect
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Archived", label: "Archived" },
                    { value: "Pending", label: "Pending" },
                  ]}
                  placeholder="Select Status"
                  className="h-10"
                  popoverWidth="w-52"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PHYSICAL STORAGE PLACEMENT */}
          <PhysicalStoragePlacementCard
            selectedCabinetId={cabinetId}
            onCabinetChange={(val) => {
              setCabinetId(val);
              setFileBoxId("");
            }}
            selectedBoxId={fileBoxId}
            onBoxChange={setFileBoxId}
            cabinets={cabinets}
          />
        </form>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <span className="text-[10px] text-[#5F5A5C] hidden sm:inline">
            Modifications are logged to audit trails.
          </span>
          <div className="flex items-center gap-2.5 ml-auto">
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
              disabled={isSaving}
              className="h-9 px-4 rounded-xl text-xs font-bold text-[#FFFCF7] bg-[#6B1D2A] hover:bg-[#8B3545] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
