import React, { useState, useEffect, useMemo } from "react";
import { X, FileEdit, Check, Lock, FileCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import ShadcnDatePicker from "@/components/ui/ShadcnDatePicker";
import StorageDropdownSelect from "../files/StorageDropdownSelect";
import { getFieldsForDocumentType } from "@/utils/documentConfigs";
import { cn } from "@/lib/utils";

/**
 * DocumentEditModal
 * Spacious, user-friendly modal for editing document metadata, template-specific
 * fields (Action Taken, Access Code, Date, Subject, etc.), and assigning physical storage location.
 * Implements /ui-ux-pro-max standards:
 * - Generous max-w-2xl/3xl viewport to eliminate cramped nesting.
 * - Dynamic Template Specification: Automatically adapts to the document type (e.g., CHED COMMUNICATIONS 2024),
 *   allowing direct editing of Action Taken, Access Code, Subject, and other configured fields.
 * - Cascading StorageDropdownSelect with visual color dots, occupancy checks, and location assurance.
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
  const [templateFormData, setTemplateFormData] = useState({});

  // Dynamic template fields for the file's document type
  const templateFields = useMemo(() => {
    if (!documentType) return [];
    return getFieldsForDocumentType(documentType).filter((f) => f !== "file_location");
  }, [documentType]);

  // Sync state whenever file changes
  useEffect(() => {
    if (file) {
      const docType = file.document_type || "General Document";
      const initialSubject = file.subject || file.title || "";

      setSubject(initialSubject);
      setDocumentType(docType);
      setStatus(file.status || "Active");

      // Auto-resolve cabinet ID from file relation or search the cabinet tree
      let resolvedCabinetId = file.file_box?.cabinet?.id ? String(file.file_box.cabinet.id) : "";
      const resolvedBoxId = file.file_box_id ? String(file.file_box_id) : "";

      if (!resolvedCabinetId && resolvedBoxId && cabinets && cabinets.length > 0) {
        const found = cabinets.find((c) =>
          (c.file_boxes || []).some((b) => String(b.id) === resolvedBoxId)
        );
        if (found) resolvedCabinetId = String(found.id);
      }

      setCabinetId(resolvedCabinetId);
      setFileBoxId(resolvedBoxId);

      // Hydrate templateFormData from dynamic_data, plus top-level columns
      const dynamic = typeof file.dynamic_data === "object" && file.dynamic_data !== null
        ? { ...file.dynamic_data }
        : {};

      // Ensure access_code, subject, and date are populated
      if (file.access_code && !dynamic.access_code) {
        dynamic.access_code = file.access_code;
      }
      if (initialSubject && !dynamic.subject) {
        dynamic.subject = initialSubject;
      }
      if (file.memo_date && !dynamic.date && !dynamic.memo_date) {
        dynamic.date = String(file.memo_date).slice(0, 10);
      }

      setTemplateFormData(dynamic);
    }
  }, [file, cabinets]);

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

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isSaving) return;

    const finalSubject = subject || templateFormData.subject || "";
    const finalAccessCode = templateFormData.access_code || file.access_code || "";
    const finalDate = templateFormData.date || templateFormData.memo_date || file.memo_date || null;

    onSave({
      subject: finalSubject,
      title: finalSubject,
      document_type: documentType,
      status,
      cabinet_id: cabinetId,
      file_box_id: fileBoxId,
      access_code: finalAccessCode,
      memo_date: finalDate,
      dynamic_data: {
        ...templateFormData,
        subject: finalSubject,
        ...(finalAccessCode ? { access_code: finalAccessCode } : {}),
        ...(finalDate ? { date: finalDate } : {}),
      },
    });
  };

  const documentIdentifier = file.document_id || file.access_code || `DOC-${file.id}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1D1A1B]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
    >
      <div
        className="bg-[#FFFCF7] w-full max-w-2xl lg:max-w-3xl rounded-2xl shadow-2xl border border-[#E8E3E1] flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 px-6 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shrink-0">
              <FileEdit className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[#1D1A1B] text-sm tracking-tight truncate">
                Edit Record &amp; Storage Location
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
            className="p-1.5 text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 scrollbar-thin">
          {/* SECTION 1: GENERAL METADATA */}
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
                onChange={(e) => {
                  const val = e.target.value;
                  setSubject(val);
                  setTemplateFormData((prev) => ({ ...prev, subject: val }));
                }}
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
                  popoverWidth="w-56"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: DYNAMIC TEMPLATE SPECIFICATION DETAILS (e.g. ACTION TAKEN, ACCESS CODE, DATE) */}
          {templateFields.length > 0 ? (
            <div className="p-4 rounded-2xl bg-[#F4E7EA]/25 border border-[#E8E3E1] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-2">
                <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#6B1D2A]" />
                  <span>{documentType} Template Specification</span>
                </span>
                <span className="text-[10px] text-[#5F5A5C] font-semibold bg-[#FFFCF7] px-2 py-0.5 rounded border border-[#E8E3E1]">
                  {templateFields.length} configured field{templateFields.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {templateFields.map((field) => {
                  const isDateField = field.toLowerCase().includes("date");
                  const labelText = field.replaceAll("_", " ");
                  const isActionTaken = field === "action_taken";
                  const isAccessCode = field === "access_code";

                  return (
                    <div
                      key={field}
                      className={cn(
                        "space-y-1.5",
                        isActionTaken && "sm:col-span-2 lg:col-span-3"
                      )}
                    >
                      <label className="text-[11px] font-bold text-[#5F5A5C] uppercase flex items-center gap-1">
                        <span>{labelText}</span>
                        {isAccessCode && <span className="text-[#6B1D2A]">*</span>}
                      </label>

                      {isDateField ? (
                        <ShadcnDatePicker
                          value={templateFormData[field] || ""}
                          onChange={(formattedVal) =>
                            setTemplateFormData((prev) => ({
                              ...prev,
                              [field]: formattedVal,
                            }))
                          }
                          placeholder={`Select ${labelText}...`}
                        />
                      ) : (
                        <Input
                          type="text"
                          placeholder={`Enter ${labelText}...`}
                          value={templateFormData[field] ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTemplateFormData((prev) => ({
                              ...prev,
                              [field]: val,
                            }));
                            if (field === "subject") {
                              setSubject(val);
                            }
                          }}
                          className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* FALLBACK TEMPLATE FIELDS FOR GENERAL DOCUMENTS */
            <div className="p-4 rounded-2xl bg-[#F4E7EA]/20 border border-[#E8E3E1] space-y-3">
              <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-2">
                <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#6B1D2A]" />
                  <span>General Document Identifiers</span>
                </span>
                <span className="text-[10px] text-[#5F5A5C] font-semibold bg-[#FFFCF7] px-2 py-0.5 rounded border border-[#E8E3E1]">
                  Standard Attributes
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#5F5A5C] uppercase">
                    Access Code / Control No.
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. ZPPSU-DOC-2024"
                    value={templateFormData.access_code ?? file.access_code ?? ""}
                    onChange={(e) =>
                      setTemplateFormData((prev) => ({
                        ...prev,
                        access_code: e.target.value,
                      }))
                    }
                    className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#5F5A5C] uppercase">
                    Document Date
                  </label>
                  <ShadcnDatePicker
                    value={templateFormData.date || (file.memo_date ? String(file.memo_date).slice(0, 10) : "")}
                    onChange={(val) =>
                      setTemplateFormData((prev) => ({
                        ...prev,
                        date: val,
                      }))
                    }
                    placeholder="Select document date..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PHYSICAL STORAGE PLACEMENT (SPACIOUS CASCADING SELECTOR) */}
          <div className="space-y-1.5 pt-1">
            <StorageDropdownSelect
              selectedCabinetId={cabinetId}
              onCabinetChange={(val) => {
                setCabinetId(val);
                setFileBoxId("");
              }}
              selectedBoxId={fileBoxId}
              onBoxChange={setFileBoxId}
              cabinets={cabinets}
            />
          </div>
        </form>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] shrink-0">
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
