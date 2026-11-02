import React from "react";
import { FileSpreadsheet, Box, Clock, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * MasterlistSummaryCards
 * Renders 4 high-level KPI cards for the Masterlist Reports Registry
 * following the institutional 11-color palette (no green).
 */
export default function MasterlistSummaryCards({
  totalEntries = 0,
  assignedCount = 0,
  unassignedCount = 0,
  selectedDocType = "ACCOMPLISHMENT REPORTS",
  totalDocTypes = 0,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TOTAL MATCHING ENTRIES */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Masterlist Entries
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalEntries}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block truncate max-w-[170px]" title={`Records in ${selectedDocType}`}>
              Active in current filter
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] shrink-0">
            <FileSpreadsheet className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* 2. PHYSICAL BOX ASSIGNED */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Physical Storage Box
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {assignedCount}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Cabinet location mapped
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F2DFB0]/50 border border-[#C99A2E]/40 text-[#A87818] shrink-0">
            <Box className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* 3. DIGITAL ONLY / UNASSIGNED */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Digital-Only Queue
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {unassignedCount}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              No physical box assigned
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1] text-[#5F5A5C] shrink-0">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* 4. ACTIVE TEMPLATE SCHEMA */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Active Template
            </span>
            <span className="text-sm font-bold text-[#1D1A1B] mt-1 block truncate" title={selectedDocType}>
              {selectedDocType}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              {totalDocTypes} templates available
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] shrink-0">
            <Layers className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
