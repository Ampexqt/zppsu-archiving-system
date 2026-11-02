import React from "react";
import { Box, BookOpen, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * BoxFolderCard
 * Displays a File Box container as an interactive folder inside a Cabinet.
 * Shows inner Archfile count and capacity.
 */
export default function BoxFolderCard({
  box,
  archfilesCount = 0,
  directDocsCount = 0,
  totalDocs = 0,
  isAdmin = false,
  onEnter,
  onEdit,
  onDelete,
}) {
  const cap = box.capacity || 100;
  const pct = Math.round((totalDocs / cap) * 100);

  return (
    <div
      className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 shadow-xs hover:border-[#6B1D2A] hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer"
      onClick={() => onEnter(box.name)}
    >
      <div>
        {/* TOP BADGE & ACTIONS */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] shrink-0">
              <Box className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
              File Box
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
                onClick={() => onEdit(box)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] cursor-pointer"
                title="Edit File Box"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(box.id)}
                className="h-7 w-7 p-0 text-[#5F5A5C] hover:text-[#4A0E1C] hover:bg-[#F4E7EA] cursor-pointer"
                title="Delete File Box"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* BOX NAME */}
        <h3 className="font-bold text-base text-[#1D1A1B] tracking-tight group-hover:text-[#6B1D2A] transition-colors">
          {box.name}
        </h3>

        {/* INNER CONTENT SUMMARY */}
        <div className="flex items-center gap-2 text-[11px] text-[#5F5A5C] mt-1">
          <span className="text-[#6B1D2A] font-bold bg-[#F4E7EA] px-2 py-0.5 rounded border border-[#E8E3E1]">
            {archfilesCount} Archfiles
          </span>
          <span>•</span>
          <span>{totalDocs} Total Records</span>
        </div>

        {/* OCCUPANCY BAR */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[11px] text-[#5F5A5C]">
            <span>Document Capacity</span>
            <span className="font-bold text-[#1D1A1B]">
              {totalDocs} / {cap} ({pct}%)
            </span>
          </div>
          <Progress value={pct} className="h-2 bg-[#E8E3E1]" />
        </div>
      </div>

      {/* FOOTER ENTER ACTION */}
      <div className="mt-5 pt-3.5 border-t border-[#E8E3E1] flex items-center justify-between text-xs font-bold text-[#6B1D2A]">
        <span className="text-[11px] font-normal text-[#5F5A5C]">
          Click to enter file box
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Open File Box <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
