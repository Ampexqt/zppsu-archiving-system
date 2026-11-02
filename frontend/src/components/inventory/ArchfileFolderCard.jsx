import React from "react";
import { BookOpen, FolderOpen, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * ArchfileFolderCard
 * Displays an Archfile container styled in classic institutional blue
 * as requested by the client ("archfile (color blue)").
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

  return (
    <div
      className="bg-[#FFFCF7] border border-[#BFDBFE] rounded-2xl p-5 shadow-xs hover:border-[#2563EB] hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer ring-1 ring-[#DBEAFE]/60"
      onClick={() => onEnter(archfile)}
    >
      <div>
        {/* TOP BLUE BADGE & ACTIONS */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] shrink-0">
              <BookOpen className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]">
              Archfile (Blue Binder)
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
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#1E40AF] hover:bg-[#DBEAFE] cursor-pointer"
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
        <h3 className="font-bold text-base text-[#1D1A1B] tracking-tight group-hover:text-[#1E40AF] transition-colors">
          {displayName || archfile.name}
        </h3>
        <p className="text-[11px] text-[#5F5A5C] mt-1">
          {filesCount} filed document records
        </p>

        {/* OCCUPANCY BAR */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[11px] text-[#5F5A5C]">
            <span>Binder Capacity</span>
            <span className="font-bold text-[#1E40AF]">
              {filesCount} / {cap} ({pct}%)
            </span>
          </div>
          <Progress value={pct} className="h-2 bg-[#DBEAFE]" />
        </div>
      </div>

      {/* FOOTER ENTER ACTION */}
      <div className="mt-5 pt-3.5 border-t border-[#BFDBFE]/60 flex items-center justify-between text-xs font-bold text-[#1E40AF]">
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
