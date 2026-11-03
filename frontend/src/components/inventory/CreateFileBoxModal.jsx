import React, { useState, useEffect } from "react";
import { X, Box, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import { detectUnitType } from "./storageTaxonomy";

/**
 * CreateFileBoxModal
 * Direct, single-step creation modal for physical File Boxes inside a Storage Cabinet.
 * Seamlessly locked to the active cabinet when inside folder drill-down.
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

  useEffect(() => {
    if (isOpen) {
      const year = new Date().getFullYear();
      setBoxName(`BOX-${year}-`);
      setDocCapacity("100");
      if (initialCabinetId) {
        setParentCabinetId(String(initialCabinetId));
      } else if (cabinets.length > 0 && !parentCabinetId) {
        setParentCabinetId(String(cabinets[0].id));
      }
    }
  }, [isOpen, initialCabinetId, cabinets]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boxName.trim() || !parentCabinetId || !docCapacity) return;

    onSubmit({
      name: boxName.trim(),
      cabinet_id: parentCabinetId,
      capacity: parseInt(docCapacity, 10),
    });

    setBoxName("");
    setDocCapacity("100");
    onClose();
  };

  const targetCabinet =
    cabinets.find((c) => String(c.id) === String(parentCabinetId)) ||
    cabinets.find((c) => String(c.id) === String(initialCabinetId));

  const targetTypeInfo = detectUnitType(targetCabinet?.name);

  const cabinetOptions = cabinets.map((cab) => {
    const typeInfo = detectUnitType(cab.name);
    const boxCount = cab.file_boxes?.length || 0;
    return {
      value: String(cab.id),
      label: cab.name,
      subtitle: `${typeInfo.label} • ${boxCount} stored`,
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
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${targetTypeInfo.badgeBg} ${targetTypeInfo.badgeText} border border-[#E8E3E1]`}
              >
                {targetTypeInfo.label}
              </span>
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

          {/* FILE BOX NAME / CODE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              File Box Name / Code <span className="text-[#6B1D2A]">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. BOX-2026-001 or Box 01"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
              autoFocus
            />
            <span className="text-[10px] text-[#5F5A5C]">
              Physical label marked on the box container (archfiles will be filed inside).
            </span>
          </div>

          {/* DOCUMENT CAPACITY */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              Document Capacity (File Limit) <span className="text-[#6B1D2A]">*</span>
            </label>
            <Input
              type="number"
              min="1"
              max="1000"
              placeholder="e.g. 100"
              value={docCapacity}
              onChange={(e) => setDocCapacity(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
            />
            <span className="text-[10px] text-[#5F5A5C]">
              Maximum estimated documents this file box container will hold.
            </span>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-[#E8E3E1] flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!boxName.trim() || !parentCabinetId || !docCapacity}
              className="h-9 px-5 rounded-xl text-xs font-bold bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer shadow-xs disabled:opacity-50"
            >
              Create File Box
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
