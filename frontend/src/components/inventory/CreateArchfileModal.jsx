import React, { useState, useEffect } from "react";
import { X, FolderClosed, Check, Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatArchfileName, ARCHFILE_COLOR_PRESETS } from "./storageTaxonomy";

/**
 * CreateArchfileModal
 * Modal for creating an Archfile Binder inside a parent File Box.
 * Supports custom color picking (swatches, HTML5 color wheel, and manual hex/name typing).
 */
export default function CreateArchfileModal({
  isOpen,
  onClose,
  onSubmit,
  cabinet = null,
  parentBoxName = "",
}) {
  const [archfileName, setArchfileName] = useState("");
  const [docCapacity, setDocCapacity] = useState("50");
  const [selectedColor, setSelectedColor] = useState("#6B1D2A"); // Default Rich Maroon

  useEffect(() => {
    if (isOpen) {
      const year = new Date().getFullYear();
      setArchfileName(`Archfile ${year}-`);
      setDocCapacity("50");
      setSelectedColor("#6B1D2A");
    }
  }, [isOpen, parentBoxName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!archfileName.trim() || !docCapacity || !cabinet) return;

    // Encodes color metadata: e.g. "Box 01 / Archfile HR [color:#7E22CE]"
    const fullName = formatArchfileName(parentBoxName, archfileName.trim(), selectedColor);

    onSubmit({
      name: fullName,
      cabinet_id: cabinet.id,
      capacity: parseInt(docCapacity, 10),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7] shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: `${selectedColor}18`, color: selectedColor, borderColor: `${selectedColor}40` }}
              className="p-2 rounded-xl border transition-colors"
            >
              <FolderClosed className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F4E7EA] text-[#6B1D2A] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                  Archfile Binder
                </span>
              </div>
              <h2 className="text-sm font-bold text-[#1D1A1B] mt-0.5">
                Create Archfile Container
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

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* LOCATION TARGET */}
          <div className="p-3 rounded-xl border border-[#E8E3E1] bg-[#FCFAF8] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#5F5A5C] block">
              Placement Target:
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D1A1B]">
              <span>{cabinet?.name || "Cabinet"}</span>
              <span className="text-[#5F5A5C]">&rarr;</span>
              <span className="text-[#6B1D2A]">{parentBoxName || "File Box"}</span>
            </div>
          </div>

          {/* ARCHFILE NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              Archfile Name / Label <span className="text-[#6B1D2A]">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Guidance Reports 2026, Personnel Records"
              value={archfileName}
              onChange={(e) => setArchfileName(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
              autoFocus
            />
            <span className="text-[10px] text-[#5F5A5C]">
              Physical label printed on the binder spine.
            </span>
          </div>

          {/* COLOR PICKER & MANUAL TYPING */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
                Binder Spine Color
              </label>
              <span className="text-[10px] text-[#5F5A5C]">Pick swatch or type hex</span>
            </div>

            {/* PRESET SWATCHES */}
            <div className="flex items-center gap-2 flex-wrap">
              {ARCHFILE_COLOR_PRESETS.map((preset) => {
                const isSelected = selectedColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setSelectedColor(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                      isSelected ? "ring-2 ring-offset-2 ring-[#1D1A1B] scale-110" : "hover:scale-105 opacity-90 hover:opacity-100"
                    }`}
                    title={preset.label}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* MANUAL COLOR INPUT & HTML5 PICKER */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={selectedColor.startsWith("#") && selectedColor.length === 7 ? selectedColor : "#6B1D2A"}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#E8E3E1] cursor-pointer p-0.5 bg-[#FFFCF7]"
                  title="Open Color Wheel"
                />
              </div>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="#6B1D2A or color name"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] font-mono text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
                />
              </div>
              {/* LIVE COLOR BADGE PREVIEW */}
              <div
                style={{ backgroundColor: `${selectedColor}20`, borderColor: `${selectedColor}40`, color: selectedColor }}
                className="px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <div style={{ backgroundColor: selectedColor }} className="w-2.5 h-2.5 rounded-full" />
                <span>Preview</span>
              </div>
            </div>
          </div>

          {/* CAPACITY */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              Document Capacity (File Limit) <span className="text-[#6B1D2A]">*</span>
            </label>
            <Input
              type="number"
              min="1"
              max="500"
              placeholder="e.g. 50"
              value={docCapacity}
              onChange={(e) => setDocCapacity(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
            />
            <span className="text-[10px] text-[#5F5A5C]">
              Maximum documents this binder can hold.
            </span>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-[#E8E3E1] flex gap-2 justify-end shrink-0">
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
              disabled={!archfileName.trim() || !docCapacity}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer shadow-xs disabled:opacity-50"
            >
              Confirm Archfile Creation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
