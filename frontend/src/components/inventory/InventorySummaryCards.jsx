import React from "react";
import { Archive, Box, BookOpen, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * InventorySummaryCards
 * Renders 4 high-level KPI cards for Physical Storage & Inventory:
 * 1. Storage Units (Cabinets/Steel/Shelves)
 * 2. File Boxes
 * 3. Archfiles (Blue Binders)
 * 4. Archived Documents
 */
export default function InventorySummaryCards({
  totalCabinets = 0,
  totalContainers = 0, // total file boxes
  totalFiledDocuments = 0,
  averageOccupancyPct = 0, // total archfiles
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. STORAGE UNITS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Storage Units
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalCabinets}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Cabinets & Shelves
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] shrink-0">
            <Archive className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* 2. FILE BOXES */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              File Boxes
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalContainers}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Cabinet box containers
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F2DFB0]/50 border border-[#C99A2E]/40 text-[#A87818] shrink-0">
            <Box className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* 3. ARCHFILES (BLUE BINDERS) */}
      <Card className="bg-[#FFFCF7] border border-[#BFDBFE] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#1E40AF] uppercase tracking-wider block">
              Archfiles (Blue Binders)
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {averageOccupancyPct}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Box archfile folders
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#DBEAFE] border border-[#BFDBFE] text-[#1E40AF] shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* 4. ARCHIVED RECORDS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Archived Copies
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalFiledDocuments}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Physically indexed files
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] shrink-0">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
