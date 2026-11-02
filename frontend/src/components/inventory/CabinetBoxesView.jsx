import React from "react";
import { ArrowLeft, Box, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoxFolderCard from "./BoxFolderCard";
import { detectUnitType } from "./storageTaxonomy";

/**
 * CabinetBoxesView
 * Displays File Boxes inside the active Cabinet (Level 1).
 */
export default function CabinetBoxesView({
  cabinet,
  boxes = [],
  isAdmin = false,
  onBack,
  onOpenCreateBox,
  onSelectBox,
  onEditContainer,
  onDeleteContainer,
}) {
  const typeInfo = detectUnitType(cabinet?.name);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* CABINET HEADER */}
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
              <span className="text-xs text-[#5F5A5C]">
                Stored: {boxes.length} {boxes.length === 1 ? "Box" : "Boxes"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1D1A1B] mt-0.5">
              {cabinet?.name}
            </h2>
          </div>
        </div>

        {isAdmin && (
          <Button
            onClick={() => onOpenCreateBox(cabinet?.id)}
            className="h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New File Box</span>
          </Button>
        )}
      </div>

      {/* FILE BOXES GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-[#6B1D2A]" />
            <h3 className="text-sm font-bold text-[#1D1A1B]">
              File Boxes in this Cabinet ({boxes.length})
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
            <div className="col-span-full py-16 text-center bg-[#FFFCF7] border border-dashed border-[#E8E3E1] rounded-2xl">
              <Box className="w-12 h-12 mx-auto mb-2 text-[#5F5A5C]/40" />
              <h4 className="font-bold text-sm text-[#1D1A1B]">
                No File Boxes In This Cabinet
              </h4>
              <p className="text-xs text-[#5F5A5C] mt-1 max-w-sm mx-auto">
                Add file boxes to organize physical folders inside this storage unit.
              </p>
              {isAdmin && (
                <Button
                  onClick={() => onOpenCreateBox(cabinet?.id)}
                  className="mt-4 h-9 px-4 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Create First File Box</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
