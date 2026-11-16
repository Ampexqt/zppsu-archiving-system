import React from "react";
import { Archive, Shield, Grid3X3, Edit2, Trash2, ChevronRight, Box, FolderClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { detectUnitType, parseBoxHierarchy } from "./storageTaxonomy";

/**
 * StorageUnitCard
 * Displays a single Cabinet, Steel Cabinet, or Shelves card in the root explorer grid.
 * Accurately displays File Box and Archfile capacities and limits.
 */
export default function StorageUnitCard({
  cab,
  isAdmin = false,
  onEnter,
  onEdit,
  onDelete,
}) {
  const typeInfo = detectUnitType(cab.name);
  const boxes = cab.file_boxes || [];

  const directBoxes = boxes.filter((b) => !parseBoxHierarchy(b.name).isArchfile);
  const directArchfiles = boxes.filter((b) => {
    const p = parseBoxHierarchy(b.name);
    return p.isArchfile && !p.parentBoxName;
  });

  const maxBoxes = cab.max_file_boxes ?? 5;
  const maxArchfiles = cab.max_direct_archfiles ?? 5;
  const totalLimit = maxBoxes + maxArchfiles;
  const totalOccupied = directBoxes.length + directArchfiles.length;
  const pct = totalLimit > 0 ? Math.min(100, Math.round((totalOccupied / totalLimit) * 100)) : 0;

  const totalDocsInCab = boxes.reduce(
    (sum, b) => sum + (b.files?.length || 0),
    0
  );

  const IconComp =
    typeInfo.id === "steel_cabinet"
      ? Shield
      : typeInfo.id === "shelves"
      ? Grid3X3
      : Archive;

  return (
    <div
      className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs hover:border-[#6B1D2A]/50 transition-all flex flex-col justify-between group cursor-pointer"
      onClick={() => onEnter(cab.id)}
    >
      <div>
        {/* TOP BADGE & ACTIONS */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl shrink-0 ${typeInfo.badgeBg} ${typeInfo.badgeText}`}>
              <IconComp className="w-5 h-5 stroke-[2]" />
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${typeInfo.badgeBg} ${typeInfo.badgeText}`}
            >
              {typeInfo.label}
            </span>
          </div>

          {isAdmin && (
            <div
              className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(cab)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                title="Edit Storage Unit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(cab.id)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
                title="Delete Storage Unit"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* NAME */}
        <h3 className="font-bold text-base text-[#1D1A1B] tracking-tight group-hover:text-[#6B1D2A] transition-colors">
          {cab.name}
        </h3>

        {/* CAPACITY BREAKDOWN PILLS */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] px-2 py-0.5 rounded border border-[#E8E3E1] inline-flex items-center gap-1">
            <Box className="w-3 h-3" />
            <span>{directBoxes.length}/{maxBoxes} Boxes</span>
          </span>
          <span className="text-[10px] font-bold text-[#A87818] bg-[#F2DFB0]/50 px-2 py-0.5 rounded border border-[#C99A2E]/30 inline-flex items-center gap-1">
            <FolderClosed className="w-3 h-3" />
            <span>{directArchfiles.length}/{maxArchfiles} Archfiles</span>
          </span>
          <span className="text-[10px] text-[#5F5A5C]">
            ({totalDocsInCab} filed docs)
          </span>
        </div>

        {/* OCCUPANCY BAR */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[11px] text-[#5F5A5C]">
            <span>Unit Physical Occupancy</span>
            <span className="font-bold text-[#1D1A1B]">
              {totalOccupied} / {totalLimit} containers ({pct}%)
            </span>
          </div>
          <Progress value={pct} className="h-2 bg-[#E8E3E1]" />
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="mt-5 pt-3.5 border-t border-[#E8E3E1] flex items-center justify-between text-xs font-bold text-[#6B1D2A]">
        <span className="text-[11px] font-normal text-[#5F5A5C]">
          Click to explore inner containers
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Open Unit <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
