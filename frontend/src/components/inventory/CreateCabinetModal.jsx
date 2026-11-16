import React, { useState } from "react";
import { X, FileBox, FolderArchive, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAIN_STORAGE_CATEGORIES, STORAGE_UNIT_TYPES } from "./storageTaxonomy";

/**
 * CreateCabinetModal
 * Guided creation modal with Main Category selection:
 * 1. Cabinet (Main category): Steel Cabinet, Standard Cabinet
 * 2. Shelves (Separate main category): Open Shelving Rack
 * Supports strict physical capacity limits for File Boxes and Direct Archfiles.
 */
export default function CreateCabinetModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [selectedType, setSelectedType] = useState("steel_cabinet");
  const [unitName, setUnitName] = useState("");
  const [maxBoxes, setMaxBoxes] = useState(5);
  const [maxArchfiles, setMaxArchfiles] = useState(5);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    const selectedObj = STORAGE_UNIT_TYPES.find((t) => t.id === typeId);
    if (!unitName || unitName.startsWith("Cabinet") || unitName.startsWith("Steel Cabinet") || unitName.startsWith("Shelves")) {
      setUnitName(`${selectedObj?.label || "Cabinet"} `);
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!unitName.trim()) return;
    const parsedBoxes = Math.max(1, parseInt(maxBoxes, 10) || 5);
    const parsedArchfiles = Math.max(0, parseInt(maxArchfiles, 10) || 5);

    onSubmit({
      name: unitName.trim(),
      max_file_boxes: parsedBoxes,
      max_direct_archfiles: parsedArchfiles,
      capacity: parsedBoxes + parsedArchfiles,
    });
    setUnitName("");
    setMaxBoxes(5);
    setMaxArchfiles(5);
    setStep(1);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const activeTypeObj = STORAGE_UNIT_TYPES.find((t) => t.id === selectedType) || STORAGE_UNIT_TYPES[0];

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
                {step === 1 ? "Select Category & Equipment" : "Configure Unit Details & Limits"}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#1D1A1B] mt-1">
              Add Storage Unit
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
            <div className="space-y-4">
              <p className="text-xs text-[#5F5A5C]">
                Select the physical storage category and equipment type to register:
              </p>

              {/* CATEGORY 1: CABINET (MAIN CATEGORY) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider">
                    1. Cabinet — Main Category
                  </span>
                  <span className="text-[10px] text-[#5F5A5C]">Holds File Boxes & Archfiles</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {STORAGE_UNIT_TYPES.filter((t) => t.categoryId === "cabinet").map((type) => {
                    const isSelected = selectedType === type.id;
                    const IconComponent = type.id === "steel_cabinet" ? FolderArchive : FileBox;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeSelect(type.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "border-[#6B1D2A] bg-[#F4E7EA]/40 ring-1 ring-[#6B1D2A]"
                            : "border-[#E8E3E1] bg-[#FFFCF7] hover:border-[#6B1D2A]/50 hover:bg-[#FCFAF8]"
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${type.badgeBg} ${type.badgeText} border border-[#E8E3E1]`}>
                          <IconComponent className="w-4 h-4 stroke-[2]" />
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
                          <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CATEGORY 2: SHELVES (SEPARATE MAIN CATEGORY) */}
              <div className="space-y-2 pt-2 border-t border-[#E8E3E1]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider">
                    2. Shelves — Separate Main Category
                  </span>
                  <span className="text-[10px] text-[#5F5A5C]">Holds File Boxes & Archfiles</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {STORAGE_UNIT_TYPES.filter((t) => t.categoryId === "shelves").map((type) => {
                    const isSelected = selectedType === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeSelect(type.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "border-[#6B1D2A] bg-[#F4E7EA]/40 ring-1 ring-[#6B1D2A]"
                            : "border-[#E8E3E1] bg-[#FFFCF7] hover:border-[#6B1D2A]/50 hover:bg-[#FCFAF8]"
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${type.badgeBg} ${type.badgeText} border border-[#E8E3E1]`}>
                          <Layers className="w-4 h-4 stroke-[2]" />
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
                          <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-2 border-t border-[#E8E3E1] flex justify-end">
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
              <div className="p-3.5 rounded-xl border border-[#E8E3E1] bg-[#FCFAF8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${activeTypeObj.badgeBg} ${activeTypeObj.badgeText}`}>
                    {activeTypeObj.label}
                  </span>
                  <span className="text-xs text-[#5F5A5C]">
                    {activeTypeObj.categoryId === "shelves" ? "Category: Shelves" : "Category: Cabinet"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#6B1D2A] hover:underline cursor-pointer"
                >
                  Change Category
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1A1B] uppercase tracking-wider block">
                  Unit Name / Identification Code <span className="text-[#6B1D2A]">*</span>
                </label>
                <Input
                  type="text"
                  placeholder={
                    selectedType === "steel_cabinet"
                      ? "e.g. Steel Cabinet 01 or SC-A"
                      : selectedType === "shelves"
                      ? "e.g. Shelves Bay 01 or Rack 1"
                      : "e.g. Cabinet 01 or Filing Cabinet A"
                  }
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] focus-visible:ring-[#6B1D2A]"
                  autoFocus
                />
                <span className="text-[10px] text-[#5F5A5C]">
                  Official physical label marked on this storage unit in the archive room.
                </span>
              </div>

              {/* CAPACITY LIMITS CONFIGURATION */}
              <div className="p-4 rounded-xl border border-[#E8E3E1] bg-[#F4E7EA]/20 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8E3E1] pb-2">
                  <div>
                    <span className="text-[11px] font-bold text-[#6B1D2A] uppercase tracking-wider block">
                      Physical Storage Capacity Limits
                    </span>
                    <span className="text-[10px] text-[#5F5A5C]">
                      Enforce strict physical limits for containers in this unit
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#FFFCF7] text-[#6B1D2A] px-2 py-0.5 rounded border border-[#E8E3E1]">
                    {(parseInt(maxBoxes, 10) || 0) + (parseInt(maxArchfiles, 10) || 0)} Total Containers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* MAX FILE BOXES */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center justify-between">
                      <span>Max File Boxes</span>
                      <span className="text-[10px] font-normal text-[#5F5A5C]">Limit</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMaxBoxes((prev) => Math.max(1, prev - 1))}
                        className="h-10 w-10 p-0 rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] font-bold"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max="500"
                        value={maxBoxes}
                        onChange={(e) => setMaxBoxes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="h-10 text-center font-bold text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMaxBoxes((prev) => prev + 1)}
                        className="h-10 w-10 p-0 rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] font-bold"
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-[10px] text-[#5F5A5C] block">
                      Max file boxes allowed in this unit (e.g. 2).
                    </span>
                  </div>

                  {/* MAX DIRECT ARCHFILES */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#1D1A1B] uppercase flex items-center justify-between">
                      <span>Direct Shelf Archfiles</span>
                      <span className="text-[10px] font-normal text-[#5F5A5C]">Shelf Limit</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMaxArchfiles((prev) => Math.max(0, prev - 1))}
                        className="h-10 w-10 p-0 rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] font-bold"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        max="500"
                        value={maxArchfiles}
                        onChange={(e) => setMaxArchfiles(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="h-10 text-center font-bold text-xs rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMaxArchfiles((prev) => prev + 1)}
                        className="h-10 w-10 p-0 rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] font-bold"
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-[10px] text-[#5F5A5C] block">
                      Standalone binders placed directly on shelves (outside boxes).
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FFFCF7] border border-[#E8E3E1] text-[10px] text-[#5F5A5C] leading-relaxed">
                  <span className="font-bold text-[#1D1A1B]">Cabinet Rules: </span>
                  <strong>Direct Archfiles</strong> applies only to standalone binders sitting directly on the cabinet shelf. Binders stored inside File Boxes are governed separately by each box container's limit.
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-[#E8E3E1] flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!unitName.trim()}
                  className="h-9 px-5 rounded-xl text-xs font-bold bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer shadow-xs disabled:opacity-50"
                >
                  Confirm Unit Registration
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
