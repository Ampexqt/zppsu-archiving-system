import React, { useState, useEffect } from "react";
import { X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import { detectContainerType, detectUnitType } from "./storageTaxonomy";

/**
 * EditFileBoxModal
 * Clean modal for updating file box / archfile container details.
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

  useEffect(() => {
    if (fileBox) {
      setBoxName(fileBox.name || "");
      setParentCabinetId(String(fileBox.cabinet_id || ""));
      setCapacity(String(fileBox.capacity || ""));
    }
  }, [fileBox]);

  if (!isOpen || !fileBox) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boxName.trim() || !parentCabinetId || !capacity) return;
    onSubmit({
      id: fileBox.id,
      name: boxName.trim(),
      cabinet_id: parentCabinetId,
      capacity: parseInt(capacity, 10),
    });
  };

  const containerInfo = detectContainerType(fileBox.name);

  const cabinetOptions = cabinets.map((cab) => {
    const typeInfo = detectUnitType(cab.name);
    return {
      value: String(cab.id),
      label: cab.name,
      subtitle: typeInfo.label,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${containerInfo.badgeBg} ${containerInfo.badgeText}`}>
              <Box className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1D1A1B]">
                Edit Storage Container
              </h2>
              <p className="text-[11px] text-[#5F5A5C]">
                Update container identification and parent placement
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
              Container Name / Code
            </label>
            <Input
              type="text"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              Parent Storage Unit
            </label>
            <ShadcnSelect
              value={parentCabinetId}
              onChange={(val) => setParentCabinetId(val)}
              options={cabinetOptions}
              searchable={true}
              searchPlaceholder="Search storage units..."
              placeholder="Select parent unit..."
              popoverWidth="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              Document Capacity (Max Records)
            </label>
            <Input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
            />
          </div>

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
              disabled={!boxName.trim() || !parentCabinetId || !capacity}
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
