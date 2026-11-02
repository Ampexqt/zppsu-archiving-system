import React from "react";
import { FileBox, FolderArchive, Layers, Box, Edit2, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectUnitType } from "./storageTaxonomy";

/**
 * CabinetFolderCard
 * Displays a storage unit (Cabinet, Steel Cabinet, Shelves) as an interactive root folder.
 * Uses accurate Lucide icons and a dynamic box counter (capacity limit not applicable).
 */
export default function CabinetFolderCard({
  cab,
  boxesCount = 0,
  archfilesCount = 0,
  totalDocs = 0,
  isAdmin = false,
  onEnter,
  onEdit,
  onDelete,
}) {
  const typeInfo = detectUnitType(cab.name);

  const IconComp =
    typeInfo.id === "steel_cabinet"
      ? FolderArchive
      : typeInfo.id === "shelves"
      ? Layers
      : FileBox;

  return (
    <div
      className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs hover:border-[#6B1D2A] hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer"
      onClick={() => onEnter(cab.id)}
    >
      <div>
        {/* TOP BADGE & ACTIONS */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2.5 rounded-xl shrink-0 ${typeInfo.badgeBg} ${typeInfo.badgeText} border border-[#E8E3E1]`}>
              <IconComp className="w-5 h-5 stroke-[2]" />
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${typeInfo.badgeBg} ${typeInfo.badgeText} border border-[#E8E3E1]`}
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

        {/* TITLE & INNER CONTENT SUMMARY */}
        <h3 className="font-bold text-base text-[#1D1A1B] tracking-tight group-hover:text-[#6B1D2A] transition-colors">
          {cab.name}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-[#5F5A5C] mt-1">
          <span className="font-semibold text-[#1D1A1B]">{boxesCount} File Boxes</span>
          <span>•</span>
          <span className="text-[#6B1D2A] font-bold">{archfilesCount} Archfiles</span>
          <span>•</span>
          <span>{totalDocs} Files</span>
        </div>

        {/* DYNAMIC BOXES COUNTER (CAPACITY NOT APPLICABLE) */}
        <div className="mt-4 pt-3 border-t border-[#E8E3E1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#5F5A5C]">
            <Box className="w-4 h-4 text-[#6B1D2A]" />
            <span className="font-medium">Boxes Stored:</span>
          </div>
          <span className="font-bold text-[#1D1A1B] text-xs bg-[#FCFAF8] border border-[#E8E3E1] px-2.5 py-0.5 rounded-md">
            {boxesCount} {boxesCount === 1 ? "File Box" : "File Boxes"}
          </span>
        </div>
      </div>

      {/* FOOTER ENTER ACTION */}
      <div className="mt-5 pt-3.5 border-t border-[#E8E3E1] flex items-center justify-between text-xs font-bold text-[#6B1D2A]">
        <span className="text-[11px] font-normal text-[#5F5A5C]">
          Click to enter unit
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Open Unit <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
