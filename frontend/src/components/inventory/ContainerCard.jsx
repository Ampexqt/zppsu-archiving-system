import React from "react";
import { Box, BookOpen, Layers, Edit2, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { detectContainerType } from "./storageTaxonomy";

/**
 * ContainerCard
 * Displays a single File Box or Archfile container card within a storage unit.
 */
export default function ContainerCard({
  box,
  isAdmin = false,
  onEdit,
  onDelete,
  onInspect,
}) {
  const typeInfo = detectContainerType(box.name);
  const filesCount = box.files?.length || 0;
  const cap = box.capacity || 100;
  const pct = Math.round((filesCount / cap) * 100);
  const IconComp =
    typeInfo.id === "archfile"
      ? BookOpen
      : typeInfo.id === "shelf_tier"
      ? Layers
      : Box;

  return (
    <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-4.5 shadow-xs hover:border-[#6B1D2A]/50 transition-all flex flex-col justify-between group">
      <div>
        {/* TOP BADGE & ACTIONS */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl shrink-0 ${typeInfo.badgeBg} ${typeInfo.badgeText}`}>
              <IconComp className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${typeInfo.badgeBg} ${typeInfo.badgeText}`}>
                {typeInfo.label}
              </span>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(box)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                title="Edit Container"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(box.id)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
                title="Delete Container"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* NAME */}
        <h3 className="font-bold text-sm text-[#1D1A1B] tracking-tight">
          {box.name}
        </h3>
        <p className="text-[11px] text-[#5F5A5C] mt-0.5">
          {filesCount} active documents archived
        </p>

        {/* OCCUPANCY BAR */}
        <div className="mt-3.5 space-y-1">
          <div className="flex justify-between text-[10px] text-[#5F5A5C]">
            <span>Record Capacity</span>
            <span className="font-semibold text-[#1D1A1B]">
              {filesCount} / {cap} ({pct}%)
            </span>
          </div>
          <Progress value={pct} className="h-1.5 bg-[#E8E3E1]" />
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div className="mt-4 pt-3 border-t border-[#E8E3E1] flex items-center justify-between">
        <span className="text-[10px] text-[#5F5A5C]">
          Status: <strong className="text-[#6B1D2A]">{box.status || "Active"}</strong>
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onInspect(box.name, box.files)}
          className="h-8 px-3 text-xs font-bold rounded-xl bg-[#FFFCF7] border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] hover:text-[#6B1D2A] cursor-pointer flex items-center gap-1.5"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#6B1D2A]" />
          <span>Inspect Files ({filesCount})</span>
        </Button>
      </div>
    </div>
  );
}
