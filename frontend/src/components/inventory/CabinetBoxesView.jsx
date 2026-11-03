import React from "react";
import { ArrowLeft, Box, FolderClosed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoxFolderCard from "./BoxFolderCard";
import ArchfileFolderCard from "./ArchfileFolderCard";
import { detectUnitType, detectMainCategory } from "./storageTaxonomy";

/**
 * CabinetBoxesView
 * Displays File Boxes and direct Archfiles inside the active Cabinet or Shelves unit.
 * Supports:
 * 1. Cabinet (Main Category): File Box, Archfile
 * 2. Shelves (Separate Main Category): File Box, Archfile
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

  const totalContainers = boxes.length + directArchfiles.length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* STORAGE UNIT HEADER */}
      <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-[#E8E3E1] text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors cursor-pointer"
            title="Back to Storage Units"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${typeInfo.badgeBg} ${typeInfo.badgeText} border border-[#E8E3E1]`}
              >
                {typeInfo.label}
              </span>
              <span className="text-[10px] font-semibold text-[#5F5A5C] bg-[#FCFAF8] px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                {isShelves ? "2. Shelves (Separate Main Category)" : "1. Cabinet (Main Category)"}
              </span>
              <span className="text-xs text-[#5F5A5C]">
                {boxes.length} {boxes.length === 1 ? "Box" : "Boxes"} • {directArchfiles.length} Direct {directArchfiles.length === 1 ? "Archfile" : "Archfiles"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1D1A1B] mt-1">
              {cabinet?.name}
            </h2>
          </div>
        </div>

        {/* ACTIONS: NEW FILE BOX & DIRECT ARCHFILE */}
        {isAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <Button
              onClick={() => onOpenCreateBox(cabinet?.id)}
              className="h-9 px-3.5 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New File Box</span>
            </Button>
            <Button
              onClick={() => onOpenCreateArchfile(cabinet, null)}
              variant="outline"
              className="h-9 px-3.5 rounded-xl border-[#6B1D2A]/30 text-[#6B1D2A] hover:bg-[#F4E7EA] hover:border-[#6B1D2A] text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer bg-[#FFFCF7]"
            >
              <Plus className="w-3.5 h-3.5 text-[#6B1D2A]" />
              <span>New Archfile</span>
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
              File Boxes in this {typeInfo.label} ({boxes.length})
            </h3>
          </div>
          <span className="text-xs text-[#5F5A5C]">
            Click a file box to enter and manage inner archfiles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boxes.map((box) => {
            const totalDocs =
              box.directFiles.length +
              box.archfiles.reduce((s, a) => s + (a.files?.length || 0), 0);

            return (
              <BoxFolderCard
                key={box.id}
                box={box}
                archfilesCount={box.archfiles.length}
                directDocsCount={box.directFiles.length}
                totalDocs={totalDocs}
                isAdmin={isAdmin}
                onEnter={onSelectBox}
                onEdit={box.rawBox ? onEditContainer : null}
                onDelete={box.rawBox ? onDeleteContainer : null}
              />
            );
          })}

          {boxes.length === 0 && (
            <div className="col-span-full py-10 text-center bg-[#FFFCF7] border border-dashed border-[#E8E3E1] rounded-2xl">
              <Box className="w-10 h-10 mx-auto mb-2 text-[#5F5A5C]/40" />
              <h4 className="font-bold text-xs text-[#1D1A1B]">
                No File Boxes In This {typeInfo.label}
              </h4>
              <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                Add file boxes to organize multiple colored archfiles and loose records.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: DIRECT ARCHFILE BINDERS (PLACED DIRECTLY IN THIS UNIT) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderClosed className="w-4 h-4 text-[#6B1D2A]" />
            <h3 className="text-sm font-bold text-[#1D1A1B]">
              Direct Archfile Binders in this {typeInfo.label} ({directArchfiles.length})
            </h3>
          </div>
          <span className="text-xs text-[#5F5A5C]">
            Binders standing directly on cabinet partitions or shelf tiers
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
              <FolderClosed className="w-8 h-8 mx-auto mb-1 text-[#5F5A5C]/40" />
              <h4 className="font-bold text-xs text-[#1D1A1B]">
                No Direct Archfiles
              </h4>
              <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                Archfiles can be placed directly in this {typeInfo.label.toLowerCase()} or inside a file box.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
