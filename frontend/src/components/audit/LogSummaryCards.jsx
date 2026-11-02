import React from "react";
import { History, ShieldCheck, FileText, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * LogSummaryCards
 * Renders 4 audit trail metric cards adhering strictly to the 11-color palette (no green).
 */
export default function LogSummaryCards({
  totalLogs = 0,
  securityCount = 0,
  filingCount = 0,
  deleteCount = 0,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* TOTAL AUDIT EVENTS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Total Logged Events
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {totalLogs}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              System audit ledger records
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
            <History className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* SECURITY & AUTH */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Auth & Security
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {securityCount}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Logins, roles & credentials
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F2DFB0]/50 border border-[#C99A2E]/40 text-[#A87818]">
            <ShieldCheck className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* FILING & ARCHIVING */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
              Filing Operations
            </span>
            <span className="text-2xl font-black text-[#1D1A1B] mt-1 block">
              {filingCount}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Storage, views & edits
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A]">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>

      {/* DISPOSAL & DELETIONS */}
      <Card className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs rounded-xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
                Disposal Actions
              </span>
              {deleteCount > 0 && (
                <span className="text-[9px] font-bold bg-[#F4E7EA] text-[#4A0E1C] px-1.5 py-0.2 rounded-full border border-[#E8E3E1]">
                  Audited
                </span>
              )}
            </div>
            <span className="text-2xl font-black text-[#4A0E1C] mt-1 block">
              {deleteCount}
            </span>
            <span className="text-[11px] text-[#5F5A5C] mt-0.5 block">
              Trash & permanent deletions
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#4A0E1C]">
            <Trash2 className="w-5 h-5 stroke-[2]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
