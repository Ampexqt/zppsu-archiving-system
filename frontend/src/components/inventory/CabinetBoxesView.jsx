import React from "react";
import { ArrowLeft, Box, FolderClosed, Plus, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoxFolderCard from "./BoxFolderCard";
import ArchfileFolderCard from "./ArchfileFolderCard";
import { detectUnitType, detectMainCategory } from "./storageTaxonomy";

/**
 * CabinetBoxesView
 * Displays File Boxes and direct Archfiles inside the active Cabinet or Shelves unit.
 * Real-time capacity meters and button state locking when limits are reached.
 */
export default function CabinetBoxesView({
  cabinet,
  boxes = [],
  directArchfiles = [],
  isAdmin = false,
  onBack,
  onOpenCreateBox,
  onOpenCreateArchfile,
  onSelectBox,
  onSelectArchfile,
  onEditContainer,
  onDeleteContainer,
}) {
  const typeInfo = detectUnitType(cabinet?.name);
  const mainCategory = detectMainCategory(cabinet?.name);
  const isShelves = mainCategory === "shelves";

  const maxBoxes = cabinet?.max_file_boxes ?? 5;
  const maxDirectArchfiles = cabinet?.max_direct_archfiles ?? 5;

  const isBoxesFull = boxes.length >= maxBoxes;
  const isArchfilesFull = directArchfiles.length >= maxDirectArchfiles;

  // Real-time cumulative documents filed in this cabinet
  const totalCabinetDocs =
    boxes.reduce(
      (acc, b) =>
        acc +
        (b.directFiles?.length || 0) +
        (b.archfiles || []).reduce((s, a) => s + (a.files?.length || 0), 0),
      0
    ) +
    directArchfiles.reduce((s, a) => s + (a.files?.length || 0), 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* STORAGE UNIT HEADER WITH CAPACITY GAUGES */}
      <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-[#E8E3E1] text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer shrink-0 mt-0.5 sm:mt-0"
            title="Back to Storage Units"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${typeInfo.badgeBg} ${typeInfo.badgeText} border border-[#E8E3E1]`}
              >
                {typeInfo.label}
              </span>
              <span className="text-[10px] font-semibold text-[#5F5A5C] bg-[#FCFAF8] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                {isShelves ? "Shelves Category" : "Cabinet Category"}
              </span>

              {/* REAL-TIME BOXES CAPACITY PILL */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                isBoxesFull
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1]"
              }`}>
                <Box className="w-3 h-3" />
                <span>Boxes: {boxes.length}/{maxBoxes} {isBoxesFull && "(FULL)"}</span>
              </span>

              {/* REAL-TIME DIRECT ARCHFILES CAPACITY PILL */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                isArchfilesFull
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-[#F2DFB0]/50 text-[#A87818] border-[#C99A2E]/30"
              }`}>
                <FolderClosed className="w-3 h-3" />
                <span>Direct Archfiles: {directArchfiles.length}/{maxDirectArchfiles} {isArchfilesFull && "(FULL)"}</span>
              </span>

              {/* REAL-TIME TOTAL FILED DOCUMENTS (READ-ONLY INFORMATIONAL METRIC) */}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1] flex items-center gap-1 shadow-2xs">
                <FileText className="w-3 h-3 text-[#6B1D2A]" />
                <span>{totalCabinetDocs} Filed {totalCabinetDocs === 1 ? "Record" : "Records"}</span>
              </span>
            </div>

            <h2 className="text-lg font-bold text-[#1D1A1B] mt-1.5">
              {cabinet?.name}
            </h2>
          </div>
        </div>

        {/* ACTIONS: NEW FILE BOX & DIRECT ARCHFILE */}
        {isAdmin && (
          <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
            <Button
              onClick={() => onOpenCreateBox(cabinet?.id)}
              disabled={isBoxesFull}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all ${
                isBoxesFull
                  ? "bg-[#E8E3E1] text-[#5F5A5C] cursor-not-allowed opacity-80"
                  : "bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] cursor-pointer"
              }`}
              title={isBoxesFull ? `File box limit reached (${boxes.length}/${maxBoxes})` : "Create new File Box"}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isBoxesFull ? `Box Limit Full (${boxes.length}/${maxBoxes})` : "New File Box"}</span>
            </Button>

            <Button
              onClick={() => onOpenCreateArchfile(cabinet, null)}
              disabled={isArchfilesFull}
              variant="outline"
              className={`h-9 px-3.5 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 bg-[#FFFCF7] transition-all ${
                isArchfilesFull
                  ? "border-[#E8E3E1] text-[#5F5A5C] cursor-not-allowed opacity-80"
                  : "border-[#6B1D2A]/30 text-[#6B1D2A] hover:bg-[#F4E7EA] hover:border-[#6B1D2A] cursor-pointer"
              }`}
              title={isArchfilesFull ? `Direct archfile limit reached (${directArchfiles.length}/${maxDirectArchfiles})` : "Create new direct Archfile"}
            >
              <Plus className="w-3.5 h-3.5 text-[#6B1D2A]" />
              <span>{isArchfilesFull ? `Archfiles Full (${directArchfiles.length}/${maxDirectArchfiles})` : "New Archfile"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* SECTION 1: FILE BOXES GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-[#6B1D2A]" />
            <h3 className="text-sm font-bold text-[#1D1A1B]">
              File Boxes in this {typeInfo.label} ({boxes.length} / {maxBoxes})
            </h3>
          </div>
          <span className="text-xs text-[#5F5A5C]">
            Click a file box to enter and manage inner archfiles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boxes.map((box) => {
            const totalDocs =
              (box.directFiles?.length || 0) +
              (box.archfiles?.reduce((s, a) => s + (a.files?.length || 0), 0) || 0);

            return (
              <BoxFolderCard
                key={box.id}
                box={box}
                totalDocs={totalDocs}
                totalFilesCount={totalDocs}
                archfilesCount={box.archfiles?.length || 0}
                isAdmin={isAdmin}
                onEnter={onSelectBox}
                onEdit={onEditContainer}
                onDelete={onDeleteContainer}
              />
            );
          })}

          {boxes.length === 0 && (
            <div className="col-span-full py-12 text-center bg-[#FFFCF7] border border-dashed border-[#E8E3E1] rounded-2xl">
              <Box className="w-10 h-10 mx-auto mb-2 text-[#6B1D2A]/30" />
              <h4 className="font-bold text-sm text-[#1D1A1B]">
                No File Boxes Yet
              </h4>
              <p className="text-xs text-[#5F5A5C] mt-1 max-w-sm mx-auto">
                File boxes hold inner color-coded archfile binders or loose files.
              </p>
              {isAdmin && !isBoxesFull && (
                <Button
                  onClick={() => onOpenCreateBox(cabinet?.id)}
                  className="mt-4 h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] text-xs font-bold"
                >
                  Create First Box
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: DIRECT ARCHFILES IN THIS STORAGE UNIT */}
      <div className="space-y-3 pt-4 border-t border-[#E8E3E1]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderClosed className="w-4 h-4 text-[#6B1D2A]" />
            <h3 className="text-sm font-bold text-[#1D1A1B]">
              Direct Archfile Binders in this {typeInfo.label} ({directArchfiles.length} / {maxDirectArchfiles})
            </h3>
          </div>
          <span className="text-xs text-[#5F5A5C]">
            Binders placed directly on shelves/cabinet without an enclosing box
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directArchfiles.map((arch) => (
            <ArchfileFolderCard
              key={arch.id}
              archfile={arch}
              displayName={arch.displayName}
              filesCount={arch.files?.length || 0}
              isAdmin={isAdmin}
              onEnter={onSelectArchfile}
              onEdit={onEditContainer}
              onDelete={onDeleteContainer}
            />
          ))}

          {directArchfiles.length === 0 && (
            <div className="col-span-full py-8 text-center bg-[#FFFCF7] border border-dashed border-[#E8E3E1] rounded-2xl">
              <p className="text-xs text-[#5F5A5C]">
                No direct archfiles placed in this storage unit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
