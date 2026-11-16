import React, { useState, useEffect } from "react";
import { X, Archive, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { detectUnitType, parseBoxHierarchy } from "./storageTaxonomy";

/**
 * EditCabinetModal
 * Clean modal for editing storage cabinet name, max file box limits, and direct archfile limits.
 * Features a real-time read-only informational document counter to show total filed records.
 * Validates that new container capacity is not set lower than currently stored containers.
 */
export default function EditCabinetModal({
  isOpen,
  onClose,
  onSubmit,
  cabinet = null,
}) {
  const [cabinetName, setCabinetName] = useState("");
  const [maxBoxes, setMaxBoxes] = useState("5");
  const [maxArchfiles, setMaxArchfiles] = useState("5");
  const [error, setError] = useState(null);

  // Compute currently stored direct boxes, direct archfiles, and total filed records
  const existingBoxes = (cabinet?.file_boxes || []).filter((b) => {
    const parsed = parseBoxHierarchy(b.name);
    return !parsed.isArchfile;
  });
  const existingDirectArchfiles = (cabinet?.file_boxes || []).filter((b) => {
    const parsed = parseBoxHierarchy(b.name);
    return parsed.isArchfile && !parsed.parentBoxName;
  });
  const allArchfiles = (cabinet?.file_boxes || []).filter((b) => {
    const parsed = parseBoxHierarchy(b.name);
    return parsed.isArchfile;
  });

  const currentBoxesCount = existingBoxes.length;
  const currentArchfilesCount = existingDirectArchfiles.length;
  const totalFiledRecords = (cabinet?.file_boxes || []).reduce((acc, b) => {
    return acc + (b.files?.length || 0);
  }, 0);

  useEffect(() => {
    if (cabinet) {
      setCabinetName(cabinet.name || "");
      setMaxBoxes(String(cabinet.max_file_boxes ?? 5));
      setMaxArchfiles(String(cabinet.max_direct_archfiles ?? 5));
      setError(null);
    }
  }, [cabinet]);

  if (!isOpen || !cabinet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const parsedBoxes = parseInt(maxBoxes, 10);
    const parsedArchfiles = parseInt(maxArchfiles, 10);

    if (isNaN(parsedBoxes) || parsedBoxes < 1) {
      setError("File box capacity must be at least 1.");
      return;
    }
    if (isNaN(parsedArchfiles) || parsedArchfiles < 0) {
      setError("Archfile capacity must be 0 or greater.");
      return;
    }

    if (parsedBoxes < currentBoxesCount) {
      setError(`Cannot reduce File Box limit to ${parsedBoxes}. This unit currently houses ${currentBoxesCount} File Boxes.`);
      return;
    }
    if (parsedArchfiles < currentArchfilesCount) {
      setError(`Cannot reduce Archfile limit to ${parsedArchfiles}. This unit currently houses ${currentArchfilesCount} direct Archfiles.`);
      return;
    }

    onSubmit({
      id: cabinet.id,
      name: cabinetName.trim(),
      max_file_boxes: parsedBoxes,
      max_direct_archfiles: parsedArchfiles,
      capacity: parsedBoxes + parsedArchfiles,
    });
  };

  const typeInfo = detectUnitType(cabinet.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${typeInfo.badgeBg} ${typeInfo.badgeText}`}>
              <Archive className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1D1A1B]">
                Edit Storage Unit
              </h2>
              <p className="text-[11px] text-[#5F5A5C]">
                Update physical filing unit parameters &amp; capacity limits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              Unit Name / Label
            </label>
            <Input
              type="text"
              value={cabinetName}
              onChange={(e) => setCabinetName(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
              required
            />
          </div>

          {/* READ-ONLY INFORMATIONAL DOCUMENT COUNTER */}
          <div className="p-3.5 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] shrink-0">
                <FileText className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-[#1D1A1B] uppercase tracking-wide">
                    Filed Documents
                  </span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
                    Read-Only Metric
                  </span>
                </div>
                <p className="text-[10px] text-[#5F5A5C] mt-0.5 truncate">
                  Cumulative records across {currentBoxesCount} {currentBoxesCount === 1 ? "box" : "boxes"} &amp; {allArchfiles.length} {allArchfiles.length === 1 ? "archfile" : "archfiles"}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span className="text-base font-extrabold text-[#6B1D2A]">
                {totalFiledRecords}
              </span>
              <span className="text-[10px] text-[#5F5A5C] block font-medium">
                {totalFiledRecords === 1 ? "document record" : "document records"}
              </span>
            </div>
          </div>

          {/* CAPACITY LIMITS SECTION */}
          <div className="p-4 rounded-xl border border-[#E8E3E1] bg-[#F4E7EA]/20 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-2">
              <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider block">
                Physical Capacity Limits
              </span>
              <span className="text-[10px] font-semibold text-[#5F5A5C]">
                {(parseInt(maxBoxes, 10) || 0) + (parseInt(maxArchfiles, 10) || 0)} Total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* MAX FILE BOXES */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center justify-between">
                  <span>File Boxes (Shelf)</span>
                  <span className="text-[10px] font-normal text-[#5F5A5C]">Current: {currentBoxesCount}</span>
                </label>
                <Input
                  type="number"
                  min={currentBoxesCount || 1}
                  value={maxBoxes}
                  onChange={(e) => setMaxBoxes(e.target.value)}
                  className="h-10 text-xs font-bold text-center rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
                  required
                />
                <span className="text-[9px] text-[#5F5A5C] block">
                  Max boxes on shelf (Min: {currentBoxesCount || 1})
                </span>
              </div>

              {/* MAX DIRECT ARCHFILES */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center justify-between">
                  <span>Direct Archfiles</span>
                  <span className="text-[10px] font-normal text-[#5F5A5C]">Current: {currentArchfilesCount}</span>
                </label>
                <Input
                  type="number"
                  min={currentArchfilesCount || 0}
                  value={maxArchfiles}
                  onChange={(e) => setMaxArchfiles(e.target.value)}
                  className="h-10 text-xs font-bold text-center rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
                  required
                />
                <span className="text-[9px] text-[#5F5A5C] block">
                  Loose binders on shelf (Min: {currentArchfilesCount || 0})
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FFFCF7] border border-[#E8E3E1] text-[10px] text-[#5F5A5C] leading-relaxed">
              <span className="font-bold text-[#1D1A1B]">Cabinet Rules: </span>
              <strong>Direct Archfiles</strong> applies exclusively to standalone binders sitting directly on cabinet shelves outside boxes. Binders packed inside individual File Boxes follow each box's own capacity limit.
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-[#E8E3E1] flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!cabinetName.trim()}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer shadow-xs disabled:opacity-50"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
