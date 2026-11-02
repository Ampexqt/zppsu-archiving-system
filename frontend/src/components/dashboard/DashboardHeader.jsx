import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderSearch, Box, FileSpreadsheet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * DashboardHeader
 * Institutional header with university branding, system status, and 1-click primary actions.
 */
export default function DashboardHeader({ user = {} }) {
  const navigate = useNavigate();
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* BRANDING & TITLE */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-[#A87818] uppercase tracking-wider bg-[#F2DFB0]/50 px-2.5 py-0.5 rounded-md border border-[#C99A2E]/30">
              ZPPSU Records & Guidance Archives
            </span>
            <span className="text-[10px] font-semibold text-[#5F5A5C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A87818] animate-pulse" />
              {todayStr}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1D1A1B] tracking-tight">
            Institutional Records Command Center
          </h1>
          <p className="text-xs text-[#5F5A5C] leading-relaxed">
            Real-time custody tracking, physical storage hierarchy oversight, and verified ledger activity.
          </p>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            onClick={() => navigate("/files")}
            className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] font-bold text-xs h-9 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>File New Record</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/document-center")}
            className="bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1] hover:bg-[#F4E7EA] font-semibold text-xs h-9 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FolderSearch className="w-3.5 h-3.5 text-[#6B1D2A]" />
            <span>Document Center</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/inventory")}
            className="bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1] hover:bg-[#F4E7EA] font-semibold text-xs h-9 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Box className="w-3.5 h-3.5 text-[#6B1D2A]" />
            <span>Storage Inventory</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/masterlist-reports")}
            className="bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1] hover:bg-[#F4E7EA] font-semibold text-xs h-9 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#6B1D2A]" />
            <span>Masterlist</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
