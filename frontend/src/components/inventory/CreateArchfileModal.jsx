import React, { useState, useEffect } from "react";
import { X, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatArchfileName } from "./storageTaxonomy";

/**
 * CreateArchfileModal
 * Dedicated modal for creating an Archfile (Blue folder) inside a parent File Box.
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

  useEffect(() => {
    if (isOpen) {
      const year = new Date().getFullYear();
      setArchfileName(`Archfile ${year}-`);
      setDocCapacity("50");
    }
  }, [isOpen, parentBoxName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!archfileName.trim() || !docCapacity || !cabinet) return;

    // Format: "Box 01 / Archfile Blue"
    const fullName = formatArchfileName(parentBoxName, archfileName.trim());

    onSubmit({
      name: fullName,
      cabinet_id: cabinet.id,
      capacity: parseInt(docCapacity, 10),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#1E40AF] uppercase tracking-wider bg-[#DBEAFE] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                  New Archfile (Blue Folder)
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* LOCATION INFO BADGE */}
          <div className="p-3 rounded-xl border border-[#E8E3E1] bg-[#FCFAF8] space-y-1">
            <span className="text-[10px] font-bold uppercase text-[#5F5A5C] block">
              Parent Placement Target:
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
              placeholder="e.g. Archfile HR-2026, Archfile Blue"
              value={archfileName}
              onChange={(e) => setArchfileName(e.target.value)}
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#2563EB]"
              autoFocus
            />
            <span className="text-[10px] text-[#5F5A5C]">
              Physical label printed on the binder spine.
            </span>
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
              className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#2563EB]"
            />
            <span className="text-[10px] text-[#5F5A5C]">
              Maximum documents this binder can hold.
            </span>
          </div>

          {/* FOOTER ACTIONS */}
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
              disabled={!archfileName.trim() || !docCapacity}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-[#1E40AF] text-[#FFFCF7] hover:bg-[#1D4ED8] cursor-pointer shadow-xs disabled:opacity-50"
            >
              Confirm Archfile Creation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
