import React, { useState, useEffect } from "react";
import { X, Box, FolderClosed, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShadcnSelect from "@/components/ui/ShadcnSelect";
import { CONTAINER_TYPES, detectUnitType } from "./storageTaxonomy";

/**
 * CreateFileBoxModal
 * Guided creation modal with Container Type selection (File Box, Archfile, Shelf Tier)
 * and searchable parent unit selection via ShadcnSelect.
 */
export default function CreateFileBoxModal({
  isOpen,
  onClose,
  onSubmit,
  cabinets = [],
  initialCabinetId = "",
}) {
  const [selectedType, setSelectedType] = useState("file_box");
  const [boxName, setBoxName] = useState("");
  const [parentCabinetId, setParentCabinetId] = useState("");
  const [docCapacity, setDocCapacity] = useState("100");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      if (initialCabinetId) {
        setParentCabinetId(String(initialCabinetId));
      } else if (cabinets.length > 0 && !parentCabinetId) {
        setParentCabinetId(String(cabinets[0].id));
      }
    }
  }, [isOpen, initialCabinetId, cabinets]);

  if (!isOpen) return null;

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    if (!boxName || boxName.startsWith("BOX") || boxName.startsWith("ARCHFILE") || boxName.startsWith("TIER")) {
      const year = new Date().getFullYear();
      if (typeId === "archfile") {
        setBoxName(`ARCHFILE-${year}-`);
      } else if (typeId === "shelf_tier") {
        setBoxName(`TIER-`);
      } else {
        setBoxName(`BOX-${year}-`);
      }
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boxName.trim() || !parentCabinetId || !docCapacity) return;

    onSubmit({
      name: boxName.trim(),
      cabinet_id: parentCabinetId,
      capacity: parseInt(docCapacity, 10),
    });

    // Reset
    setBoxName("");
    setDocCapacity("100");
    setStep(1);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const activeTypeObj = CONTAINER_TYPES.find((t) => t.id === selectedType) || CONTAINER_TYPES[0];

  const cabinetOptions = cabinets.map((cab) => {
    const typeInfo = detectUnitType(cab.name);
    const boxCount = cab.file_boxes?.length || 0;
    return {
      value: String(cab.id),
      label: cab.name,
      subtitle: `${typeInfo.label} • ${boxCount}/${cab.capacity || 0} used`,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#A87818] uppercase tracking-wider bg-[#F2DFB0]/50 px-2 py-0.5 rounded-md border border-[#C99A2E]/30">
                Step {step} of 2
              </span>
              <span className="text-xs text-[#5F5A5C]">
                {step === 1 ? "Select Container Type" : "Configure Container & Parent Unit"}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#1D1A1B] mt-1">
              Add Container to Storage
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="w-full bg-[#E8E3E1] h-1">
          <div
            className="bg-[#6B1D2A] h-1 transition-all duration-300"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {/* MODAL BODY */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-3">
              <p className="text-xs text-[#5F5A5C]">
                Select the type of physical sub-container to place inside a storage unit:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {CONTAINER_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  const IconComponent =
                    type.id === "archfile"
                      ? FolderClosed
                      : type.id === "shelf_tier"
                      ? Layers
                      : Box;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTypeSelect(type.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? "border-[#6B1D2A] bg-[#F4E7EA]/40 ring-1 ring-[#6B1D2A]"
                          : "border-[#E8E3E1] bg-[#FFFCF7] hover:border-[#6B1D2A]/50 hover:bg-[#FCFAF8]"
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${type.badgeBg} ${type.badgeText}`}>
                        <IconComponent className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1D1A1B]">
                            {type.fullTitle}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#6B1D2A] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#5F5A5C] mt-0.5 line-clamp-2">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* FOOTER ACTIONS FOR STEP 1 */}
              <div className="pt-3 border-t border-[#E8E3E1] flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="h-9 px-4 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl border border-[#E8E3E1] bg-[#FCFAF8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${activeTypeObj.badgeBg} ${activeTypeObj.badgeText}`}>
                    {activeTypeObj.label}
                  </span>
                  <span className="text-xs text-[#5F5A5C]">Selected Container</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#6B1D2A] hover:underline cursor-pointer"
                >
                  Change Type
                </button>
              </div>

              {/* PARENT CABINET SELECT VIA SHADCN */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
                  Parent Storage Unit (Cabinet / Steel / Shelves) <span className="text-[#6B1D2A]">*</span>
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

              {/* CONTAINER NAME / CODE */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
                  Container Name / Code <span className="text-[#6B1D2A]">*</span>
                </label>
                <Input
                  type="text"
                  placeholder={
                    selectedType === "archfile"
                      ? "e.g. ARCHFILE-HR-2026-A"
                      : selectedType === "shelf_tier"
                      ? "e.g. TIER-01-LEFT"
                      : "e.g. BOX-2024-ALPHA"
                  }
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
                  autoFocus
                />
                <span className="text-[10px] text-[#5F5A5C]">
                  Physical label marked on the box, binder spine, or partition.
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
                  Maximum number of paper documents this container can hold.
                </span>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-[#E8E3E1] flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-10 px-4 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!boxName.trim() || !parentCabinetId || !docCapacity}
                  className="h-10 px-5 rounded-xl text-xs font-bold bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer shadow-xs disabled:opacity-50"
                >
                  Confirm Container Creation
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
