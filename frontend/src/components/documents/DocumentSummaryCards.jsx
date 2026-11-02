import React from "react";
import { FileText, CheckCircle2, Archive, Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * DocumentSummaryCards
 * Renders the top 4 status cards with distinct subtle semantic colors and clickable filter.
 */
export default function DocumentSummaryCards({
  totalDocuments = 0,
  activeDocuments = 0,
  archivedDocuments = 0,
  unassignedStorageCount = 0,
  selectedStorageFilter = "",
  onToggleUnassignedFilter,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* TOTAL ACTIVE RECORDS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Total Active Records
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalDocuments}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Registered in system
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* ACTIVE FILES */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Active Files
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {activeDocuments}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Current & in circulation
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* ARCHIVED IN VAULT */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Archived in Vault
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {archivedDocuments}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Long-term preservation
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#E8E3E1]/50 border border-[#E8E3E1] text-[#5F5A5C]">
            <Archive className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* AWAITING STORAGE BOX (INTERACTIVE QUICK FILTER) */}
      <Card 
        onClick={() => {
          if (unassignedStorageCount > 0 && onToggleUnassignedFilter) {
            onToggleUnassignedFilter();
          }
        }}
        className={`bg-[#FFFCF7] border transition-all rounded-xl ${
          unassignedStorageCount > 0 
            ? selectedStorageFilter === "unassigned"
              ? "border-[#6B1D2A] ring-2 ring-[#6B1D2A]/20 shadow-xs cursor-pointer"
              : "border-[#C99A2E]/50 shadow-xs cursor-pointer hover:border-[#A87818]" 
            : "border-[#E8E3E1] shadow-xs"
        }`}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                Awaiting Storage Box
              </span>
              {unassignedStorageCount > 0 && (
                <span className="text-[9px] font-bold bg-[#F2DFB0] text-[#A87818] px-1.5 py-0.2 rounded-full border border-[#C99A2E]/50">
                  Needs Filing
                </span>
              )}
            </div>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {unassignedStorageCount}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              {unassignedStorageCount > 0 
                ? selectedStorageFilter === "unassigned"
                  ? "Active filter (click to reset)"
                  : "Click to filter records"
                : "All files stored"}
            </span>
          </div>
          <div className={`p-2.5 rounded-xl border ${
            unassignedStorageCount > 0 
              ? "bg-[#F2DFB0]/50 border-[#C99A2E]/40 text-[#A87818]" 
              : "bg-[#E8E3E1]/40 border-[#E8E3E1] text-[#5F5A5C]"
          }`}>
            <Box className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
