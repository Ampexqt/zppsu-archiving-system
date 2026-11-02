import React from "react";
import { FolderClosed, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { parseBoxHierarchy } from "./storageTaxonomy";

/**
 * ArchfileFolderCard
 * Displays an Archfile Binder with custom user-selected spine color,
 * accurate folder icon, and clean document capacity tracking.
 */
export default function ArchfileFolderCard({
  archfile,
  displayName = "",
  filesCount = 0,
  isAdmin = false,
  onEnter,
  onEdit,
  onDelete,
}) {
  const cap = archfile.capacity || 50;
  const pct = Math.round((filesCount / cap) * 100);

  // Extract custom color: from archfile.color or parse from name
  const parsed = parseBoxHierarchy(archfile?.name || "");
  const color = archfile?.color || parsed.color || "#6B1D2A";
  const label = displayName || parsed.archfileName || archfile.name;

  return (
    <div
      className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
      onClick={() => onEnter(archfile)}
    >
      {/* LEFT BINDER SPINE ACCENT STRIP IN CUSTOM COLOR */}
      <div
        style={{ backgroundColor: color }}
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors"
      />

      <div className="pl-1">
        {/* TOP BADGE & ACTIONS */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              style={{ backgroundColor: `${color}18`, color: color, borderColor: `${color}35` }}
              className="p-2.5 rounded-xl border shrink-0 transition-colors"
            >
              <FolderClosed className="w-5 h-5 stroke-[2]" />
            </div>
            <span
              style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}
              className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border"
            >
              Archfile Binder
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
                onClick={() => onEdit(archfile)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] cursor-pointer"
                title="Edit Archfile"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(archfile.id)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
                title="Delete Archfile"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* ARCHFILE NAME */}
        <h3 className="font-bold text-base text-[#1D1A1B] tracking-tight group-hover:text-[#6B1D2A] transition-colors">
          {label}
        </h3>
        <p className="text-[11px] text-[#5F5A5C] mt-1">
          {filesCount} filed document records
        </p>

        {/* OCCUPANCY BAR */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[11px] text-[#5F5A5C]">
            <span>Binder Capacity</span>
            <span className="font-bold text-[#1D1A1B]">
              {filesCount} / {cap} ({pct}%)
            </span>
          </div>
          <Progress value={pct} className="h-2 bg-[#E8E3E1]" />
        </div>
      </div>

      {/* FOOTER ENTER ACTION */}
      <div className="mt-5 pt-3.5 border-t border-[#E8E3E1] flex items-center justify-between text-xs font-bold text-[#6B1D2A] pl-1">
        <span className="text-[11px] font-normal text-[#5F5A5C]">
          Click to view records
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Open Archfile <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
