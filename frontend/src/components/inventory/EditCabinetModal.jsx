import React, { useState, useEffect } from "react";
import { X, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { detectUnitType } from "./storageTaxonomy";

/**
 * EditCabinetModal
 * Clean modal for editing storage cabinet name and capacity.
 */
export default function EditCabinetModal({
  isOpen,
  onClose,
  onSubmit,
  cabinet = null,
}) {
  const [cabinetName, setCabinetName] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (cabinet) {
      setCabinetName(cabinet.name || "");
      setCapacity(String(cabinet.capacity || ""));
    }
  }, [cabinet]);

  if (!isOpen || !cabinet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cabinetName.trim() || !capacity) return;
    onSubmit({
      id: cabinet.id,
      name: cabinetName.trim(),
      capacity: parseInt(capacity, 10),
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
                Update physical filing unit parameters
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
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
              Box / Container Capacity
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
              disabled={!cabinetName.trim() || !capacity}
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
