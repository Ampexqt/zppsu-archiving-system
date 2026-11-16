import React, { useState, useEffect } from "react";
import { X, Box, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import { detectUnitType, parseBoxHierarchy } from "./storageTaxonomy";

/**
 * CreateFileBoxModal
 * Direct, single-step creation modal for physical File Boxes inside a Storage Cabinet.
 * Enforces cabinet file box limits, prevents duplicate box names, and avoids double-submissions.
 */
export default function CreateFileBoxModal({
  isOpen,
  onClose,
  onSubmit,
  cabinets = [],
  initialCabinetId = "",
}) {
  const [boxName, setBoxName] = useState("");
  const [parentCabinetId, setParentCabinetId] = useState("");
  const [docCapacity, setDocCapacity] = useState("100");
  const [maxArchfiles, setMaxArchfiles] = useState("5");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const targetCabinet =
    cabinets.find((c) => String(c.id) === String(parentCabinetId)) ||
    cabinets.find((c) => String(c.id) === String(initialCabinetId));

  const targetTypeInfo = detectUnitType(targetCabinet?.name);

  // Calculate current file boxes inside the target cabinet
  const existingBoxes = (targetCabinet?.file_boxes || []).filter((b) => {
    const parsed = parseBoxHierarchy(b.name);
    return !parsed.isArchfile;
  });
  const currentBoxesCount = existingBoxes.length;
  const maxBoxesLimit = targetCabinet?.max_file_boxes ?? 5;
  const isCabinetFull = currentBoxesCount >= maxBoxesLimit;

  // Check if current name already exists in target cabinet
  const isDuplicateName = existingBoxes.some(
    (b) => b.name.trim().toLowerCase() === boxName.trim().toLowerCase()
  );

  useEffect(() => {
    if (isOpen) {
      const activeCab =
        cabinets.find((c) => String(c.id) === String(initialCabinetId)) ||
        (cabinets.length > 0 ? cabinets[0] : null);

      const activeBoxes = (activeCab?.file_boxes || []).filter(
        (b) => !parseBoxHierarchy(b.name).isArchfile
      );

      // Auto-suggest next sequential box code e.g. Box 03 or BOX-2026-03
      const nextNum = activeBoxes.length + 1;
      setBoxName(`Box ${String(nextNum).padStart(2, "0")}`);
      setDocCapacity("100");
      setMaxArchfiles("5");
      setIsSubmitting(false);
      setError(null);

      if (initialCabinetId) {
        setParentCabinetId(String(initialCabinetId));
      } else if (cabinets.length > 0 && !parentCabinetId) {
        setParentCabinetId(String(cabinets[0].id));
      }
    }
  }, [isOpen, initialCabinetId, cabinets]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !boxName.trim() ||
      !parentCabinetId ||
      !docCapacity ||
      isCabinetFull ||
      isDuplicateName ||
      isSubmitting
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: boxName.trim(),
        cabinet_id: parentCabinetId,
        capacity: parseInt(docCapacity, 10),
        max_archfiles: parseInt(maxArchfiles, 10) || 5,
      });

      setBoxName("");
      setDocCapacity("100");
      setMaxArchfiles("5");
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create file box");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cabinetOptions = cabinets.map((cab) => {
    const typeInfo = detectUnitType(cab.name);
    const boxCount = (cab.file_boxes || []).filter((b) => !parseBoxHierarchy(b.name).isArchfile).length;
    const limit = cab.max_file_boxes ?? 5;
    return {
      value: String(cab.id),
      label: cab.name,
      subtitle: `${typeInfo.label} • ${boxCount}/${limit} boxes`,
      disabled: boxCount >= limit,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] shrink-0">
              <Box className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4E7EA] text-[#6B1D2A] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                  File Box Container
                </span>
              </div>
              <h2 className="text-sm font-bold text-[#1D1A1B] mt-0.5">
                New File Box
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* LOCATION TARGET BADGE */}
          {targetCabinet ? (
            <div className="p-3.5 rounded-xl border border-[#E8E3E1] bg-[#FCFAF8] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#5F5A5C] block">
                  Designated Storage Location
                </span>
                <span className="text-xs font-bold text-[#1D1A1B] mt-0.5 block">
                  {targetCabinet.name}
                </span>
                <span className="text-[10px] text-[#5F5A5C] mt-0.5 block">
                  Capacity: {currentBoxesCount} / {maxBoxesLimit} File Boxes
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${targetTypeInfo.badgeBg} ${targetTypeInfo.badgeText} border border-[#E8E3E1]`}
                >
                  {targetTypeInfo.label}
                </span>
                {isCabinetFull && (
                  <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                    Box Limit Reached
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
                Parent Storage Unit <span className="text-[#6B1D2A]">*</span>
              </label>
              <ShadcnSelect
                value={parentCabinetId}
                onChange={(val) => setParentCabinetId(val)}
                options={cabinetOptions}
                searchable={true}
                searchPlaceholder="Search parent storage unit..."
                placeholder="Select target storage unit..."
                popoverWidth="w-full"
              />
            </div>
          )}

          {/* WARNING IF FULL */}
          {isCabinetFull && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Storage Unit Box Limit Reached ({currentBoxesCount}/{maxBoxesLimit})</strong>
                <p className="text-[11px] mt-0.5 text-red-600">
                  Cannot add more file boxes to this storage unit. Increase the cabinet's box limit or select another unit.
                </p>
              </div>
            </div>
          )}

          {/* WARNING IF DUPLICATE NAME */}
          {isDuplicateName && !isCabinetFull && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Duplicate Container Name</strong>
                <p className="text-[11px] mt-0.5">
                  A file box named &lsquo;{boxName.trim()}&rsquo; already exists in this storage unit. Please specify a unique box number or code.
                </p>
              </div>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* FILE BOX NAME / CODE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              File Box Name / Code <span className="text-[#6B1D2A]">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Box 01 or BOX-2026-001"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
              disabled={isCabinetFull || isSubmitting}
              autoFocus
            />
            <span className="text-[10px] text-[#5F5A5C]">
              Physical label marked on the box container (archfiles will be filed inside).
            </span>
          </div>

          {/* CAPACITY LIMITS: ARCHFILES & DOCUMENT FILES */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-[#E8E3E1] bg-[#F4E7EA]/20">
            {/* INNER ARCHFILES CAPACITY */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1D1A1B] uppercase block">
                Max Archfiles Limit
              </label>
              <Input
                type="number"
                min="1"
                max="50"
                value={maxArchfiles}
                onChange={(e) => setMaxArchfiles(e.target.value)}
                className="h-9 text-xs font-bold text-center rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B]"
                disabled={isCabinetFull || isSubmitting}
              />
              <span className="text-[9px] text-[#5F5A5C] block">
                Max binders inside box (e.g. 5)
              </span>
            </div>

            {/* DOCUMENT FILES CAPACITY */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#1D1A1B] uppercase block">
                Files Limit
              </label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={docCapacity}
                onChange={(e) => setDocCapacity(e.target.value)}
                className="h-9 text-xs font-bold text-center rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B]"
                disabled={isCabinetFull || isSubmitting}
              />
              <span className="text-[9px] text-[#5F5A5C] block">
                Estimated max documents
              </span>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-[#E8E3E1] flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !boxName.trim() ||
                !parentCabinetId ||
                !docCapacity ||
                isCabinetFull ||
                isDuplicateName ||
                isSubmitting
              }
              className="h-9 px-5 rounded-xl text-xs font-bold bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create File Box"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
