import React, { useState, useEffect } from "react";
import { X, Box, FolderClosed, Archive, AlertCircle, Check, Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import {
  detectContainerType,
  detectUnitType,
  detectMainCategory,
  parseBoxHierarchy,
  formatArchfileName,
  ARCHFILE_COLOR_PRESETS,
  getColorNameFromHex,
} from "./storageTaxonomy";

/**
 * EditFileBoxModal
 * Clean, context-aware modal for updating storage container details.
 * - Shows an informative, read-only location strip for the current parent cabinet
 *   (eliminating the redundant/empty mandatory dropdown).
 * - Provides an optional inline relocation toggle if the user explicitly wants to move the container.
 * - Seamlessly supports both File Boxes and Archfile Binders (with custom spine color swatches).
 */
export default function EditFileBoxModal({
  isOpen,
  onClose,
  onSubmit,
  fileBox = null,
  cabinets = [],
}) {
  const [boxName, setBoxName] = useState("");
  const [parentCabinetId, setParentCabinetId] = useState("");
  const [capacity, setCapacity] = useState("");
  const [maxArchfiles, setMaxArchfiles] = useState("5");
  const [selectedColor, setSelectedColor] = useState("#6B1D2A");
  const [showRelocateSelect, setShowRelocateSelect] = useState(false);
  const [error, setError] = useState(null);

  const containerInfo = detectContainerType(fileBox?.name);
  const parsed = parseBoxHierarchy(fileBox?.name || "");
  const isDirectFileBox = !parsed.isArchfile;

  // Resolve parent cabinet through multiple fallback strategies
  const resolvedCabinetId =
    fileBox?.cabinet_id ||
    fileBox?.rawBox?.cabinet_id ||
    cabinets.find((c) =>
      (c.file_boxes || []).some(
        (b) =>
          b.id === fileBox?.id ||
          (b.name && b.name.trim().toLowerCase() === (fileBox?.name || "").trim().toLowerCase())
      )
    )?.id ||
    "";

  const parentCabinet = cabinets.find(
    (c) => String(c.id) === String(parentCabinetId || resolvedCabinetId)
  );

  const typeInfo = detectUnitType(parentCabinet?.name);
  const mainCategory = detectMainCategory(parentCabinet?.name);
  const isShelves = mainCategory === "shelves";

  // Calculate current nested archfiles for this file box
  const currentNestedArchfiles = (parentCabinet?.file_boxes || []).filter((b) => {
    const p = parseBoxHierarchy(b.name);
    return (
      p.parentBoxName &&
      p.parentBoxName.toLowerCase() === (fileBox?.name || "").trim().toLowerCase()
    );
  }).length;

  useEffect(() => {
    if (fileBox) {
      const p = parseBoxHierarchy(fileBox.name || "");
      if (p.isArchfile) {
        setBoxName(p.archfileName || fileBox.name || "");
        setSelectedColor(p.color || "#6B1D2A");
      } else {
        setBoxName(fileBox.name || "");
        setSelectedColor("#6B1D2A");
      }

      const initialCabId = String(
        fileBox.cabinet_id ||
        fileBox.rawBox?.cabinet_id ||
        cabinets.find((c) =>
          (c.file_boxes || []).some(
            (b) =>
              b.id === fileBox?.id ||
              (b.name && b.name.trim().toLowerCase() === (fileBox?.name || "").trim().toLowerCase())
          )
        )?.id ||
        ""
      );

      setParentCabinetId(initialCabId);
      setCapacity(String(fileBox.capacity || (p.isArchfile ? "50" : "100")));
      setMaxArchfiles(String(fileBox.max_archfiles ?? 5));
      setShowRelocateSelect(false);
      setError(null);
    }
  }, [fileBox, cabinets]);

  if (!isOpen || !fileBox) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const parsedArchfilesLimit = parseInt(maxArchfiles, 10);
    if (isDirectFileBox && parsedArchfilesLimit < currentNestedArchfiles) {
      setError(
        `Cannot reduce Archfile limit to ${parsedArchfilesLimit}. This box currently houses ${currentNestedArchfiles} archfile binders.`
      );
      return;
    }

    if (!boxName.trim() || !capacity) return;

    const targetCabinetId = parentCabinetId || resolvedCabinetId;

    if (parsed.isArchfile) {
      const formattedName = formatArchfileName(
        parsed.parentBoxName || null,
        boxName.trim(),
        selectedColor
      );
      onSubmit({
        id: fileBox.id,
        name: formattedName,
        cabinet_id: targetCabinetId,
        capacity: parseInt(capacity, 10),
      });
    } else {
      onSubmit({
        id: fileBox.id,
        name: boxName.trim(),
        cabinet_id: targetCabinetId,
        capacity: parseInt(capacity, 10),
        max_archfiles: parsedArchfilesLimit,
      });
    }
  };

  const cabinetOptions = cabinets.map((cab) => {
    const cabTypeInfo = detectUnitType(cab.name);
    return {
      value: String(cab.id),
      label: cab.name,
      subtitle: cabTypeInfo.label,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] shrink-0">
          <div className="flex items-center gap-2.5">
            {parsed.isArchfile ? (
              <div
                style={{
                  backgroundColor: `${selectedColor}18`,
                  color: selectedColor,
                  borderColor: `${selectedColor}40`,
                }}
                className="p-2 rounded-xl border transition-colors shrink-0"
              >
                <FolderClosed className="w-4 h-4 stroke-[2]" />
              </div>
            ) : (
              <div className={`p-2 rounded-xl ${containerInfo.badgeBg} ${containerInfo.badgeText} shrink-0`}>
                <Box className="w-4 h-4 stroke-[2]" />
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-[#1D1A1B]">
                {parsed.isArchfile ? "Edit Archfile Binder" : "Edit Storage Container"}
              </h2>
              <p className="text-[11px] text-[#5F5A5C]">
                {parsed.isArchfile
                  ? "Update binder details, spine color & file capacity"
                  : "Update container identification & capacity limits"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* CONTAINER NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              {parsed.isArchfile ? "Archfile / Binder Name *" : "Container Name / Code *"}
            </label>
            <Input
              type="text"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              placeholder={parsed.isArchfile ? "e.g. Student Evaluation Binders" : "e.g. Box 01"}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
              required
            />
          </div>

          {/* COLOR PICKER (IF ARCHFILE) */}
          {parsed.isArchfile && (
            <div className="space-y-3 p-3.5 rounded-xl border border-[#E8E3E1] bg-[#F4E7EA]/20">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#1D1A1B] uppercase tracking-wider block">
                  Binder Spine Color Code
                </label>
                <span className="text-[10px] text-[#5F5A5C]">
                  Pick preset or customize hex
                </span>
              </div>

              {/* PRESET SWATCHES */}
              <div className="flex items-center gap-2 flex-wrap">
                {ARCHFILE_COLOR_PRESETS.map((color) => {
                  const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setSelectedColor(color.hex)}
                      title={color.label}
                      style={{ backgroundColor: color.hex }}
                      className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-[#6B1D2A] ring-offset-2 scale-110 shadow-xs"
                          : "hover:scale-105 opacity-90"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* CUSTOM COLOR WHEEL PICKER & HEX INPUT */}
              <div className="pt-2 border-t border-[#E8E3E1] flex items-center gap-2">
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={
                      selectedColor.startsWith("#") && selectedColor.length === 7
                        ? selectedColor
                        : "#6B1D2A"
                    }
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-[#E8E3E1] cursor-pointer p-0.5 bg-[#FFFCF7] shadow-2xs hover:scale-105 transition-transform"
                    title="Open Custom Color Wheel"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    placeholder="#6B1D2A or color name"
                    className="h-9 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] font-mono text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
                  />
                </div>
                {/* LIVE COLOR BADGE PREVIEW */}
                <div
                  style={{
                    backgroundColor: `${selectedColor}18`,
                    color: selectedColor,
                    borderColor: `${selectedColor}40`,
                  }}
                  className="px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <span
                    style={{ backgroundColor: selectedColor }}
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-2xs"
                  />
                  <span className="text-[11px] font-semibold truncate max-w-[85px]">
                    {getColorNameFromHex(selectedColor) || selectedColor}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STORAGE UNIT PLACEMENT (INFORMATIVE READ-ONLY STRIP) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                Storage Unit Placement
              </label>
              <button
                type="button"
                onClick={() => setShowRelocateSelect((prev) => !prev)}
                className="text-[11px] font-semibold text-[#6B1D2A] hover:underline cursor-pointer"
              >
                {showRelocateSelect ? "Keep Current Unit" : "Relocate..."}
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F4E7EA]/40 border border-[#E8E3E1]">
              <div className="p-2 rounded-lg bg-[#FFFCF7] border border-[#E8E3E1] text-[#6B1D2A] shrink-0">
                <Archive className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#1D1A1B] truncate">
                    {parentCabinet?.name || "Current Storage Unit"}
                  </span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#FFFCF7] text-[#6B1D2A] border border-[#E8E3E1]">
                    {typeInfo.label}
                  </span>
                </div>
                <p className="text-[10px] text-[#5F5A5C] mt-0.5">
                  {parsed.isArchfile && parsed.parentBoxName
                    ? `Housed inside ${parsed.parentBoxName} within this unit`
                    : `Registered in ${isShelves ? "Shelves Category" : "Cabinet Category"} (Active Placement)`}
                </p>
              </div>
            </div>

            {/* OPTIONAL RELOCATION DROPDOWN - ONLY EXPANDS ON DEMAND */}
            {showRelocateSelect && (
              <div className="pt-2 animate-in fade-in duration-150 space-y-1">
                <label className="text-[10px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                  Select Destination Storage Unit
                </label>
                <ShadcnSelect
                  value={parentCabinetId}
                  onChange={(val) => setParentCabinetId(val)}
                  options={cabinetOptions}
                  searchable={true}
                  searchPlaceholder="Search destination storage unit..."
                  placeholder="Select destination unit..."
                  popoverWidth="w-full"
                />
              </div>
            )}
          </div>

          {/* CAPACITY LIMITS */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-[#E8E3E1] bg-[#F4E7EA]/20">
            {/* INNER ARCHFILES CAPACITY (IF FILE BOX) */}
            {isDirectFileBox ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center justify-between">
                  <span>Archfiles</span>
                  <span className="text-[10px] font-normal text-[#5F5A5C]">
                    Current: {currentNestedArchfiles}
                  </span>
                </label>
                <Input
                  type="number"
                  min={currentNestedArchfiles || 1}
                  value={maxArchfiles}
                  onChange={(e) => setMaxArchfiles(e.target.value)}
                  className="h-9 text-xs font-bold text-center rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B]"
                  required
                />
                <span className="text-[9px] text-[#5F5A5C] block">
                  Min limit: {currentNestedArchfiles || 1}
                </span>
              </div>
            ) : null}

            {/* DOCUMENT FILES CAPACITY */}
            <div className={`space-y-1 ${!isDirectFileBox ? "col-span-2" : ""}`}>
              <label className="text-[11px] font-bold text-[#1D1A1B] uppercase block">
                Document Files Limit
              </label>
              <Input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="h-9 text-xs font-bold text-center rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B]"
                required
              />
              <span className="text-[9px] text-[#5F5A5C] block">
                Estimated files capacity
              </span>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ACTIONS */}
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
              disabled={!boxName.trim() || !capacity}
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
