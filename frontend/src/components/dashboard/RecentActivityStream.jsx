import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ShieldCheck, ArrowRight, Eye, Box, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseBoxHierarchy } from "../inventory/storageTaxonomy";

/**
 * RecentActivityStream
 * Tabbed live stream between Recently Ingested Documents and Audit Activity Logs.
 */
export default function RecentActivityStream({
  recentFiles = [],
  recentActivities = [],
  onViewDocument,
}) {
  const [activeTab, setActiveTab] = useState("documents"); // "documents" | "audit"

  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-[#E8E3E1]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-[#1D1A1B]">
              Real-Time Archival Stream
            </CardTitle>
            <CardDescription className="text-[11px] text-[#5F5A5C]">
              Continuous feed of recently ingested documents and chain-of-custody activities
            </CardDescription>
          </div>

          {/* TAB SWITCHER */}
          <div className="inline-flex p-1 bg-[#F4E7EA] rounded-xl border border-[#E8E3E1] self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Latest Records ({recentFiles.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Log ({recentActivities.length})</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* TAB 1: RECENT INGESTED DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-[#5F5A5C] uppercase bg-[#FCFAF8] border-b border-[#E8E3E1]">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Document ID</th>
                  <th className="px-4 py-2.5 font-bold">Subject / Title</th>
                  <th className="px-4 py-2.5 font-bold">Series Type</th>
                  <th className="px-4 py-2.5 font-bold">Physical Storage</th>
                  <th className="px-4 py-2.5 font-bold">Filed By</th>
                  <th className="px-4 py-2.5 font-bold">Date</th>
                  <th className="px-4 py-2.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3E1]">
                {recentFiles.length > 0 ? (
                  recentFiles.slice(0, 5).map((file) => {
                    const boxParsed = file.file_box ? parseBoxHierarchy(file.file_box.name) : null;
                    const cabinetName = file.file_box?.cabinet?.name || file.cabinet?.name;

                    return (
                      <tr
                        key={file.id}
                        className="hover:bg-[#F4E7EA]/40 transition-colors group"
                      >
                        <td className="px-4 py-3 font-mono font-bold text-[#6B1D2A]">
                          {file.document_id || `ID-${file.id}`}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#1D1A1B] max-w-xs truncate" title={file.subject || file.title}>
                          {file.subject || file.title || "Untitled Document"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-semibold text-[#5F5A5C] bg-[#E8E3E1]/50 px-2 py-0.5 rounded-md border border-[#E8E3E1]">
                            {file.document_type || "General"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {cabinetName ? (
                            <span className="text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] px-2 py-0.5 rounded-md border border-[#E8E3E1] inline-flex items-center gap-1">
                              <Box className="w-3 h-3 text-[#6B1D2A]" />
                              {cabinetName} {boxParsed ? `> ${boxParsed.displayName}` : ""}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#A87818] bg-[#F2DFB0]/40 px-2 py-0.5 rounded-md border border-[#C99A2E]/20">
                              Awaiting Box
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#5F5A5C] max-w-[140px] truncate">
                          {file.user?.email || "System"}
                        </td>
                        <td className="px-4 py-3 text-[#5F5A5C]">
                          {file.created_at ? new Date(file.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDocument(file)}
                            className="h-7 px-2 text-[11px] font-bold text-[#6B1D2A] hover:bg-[#F4E7EA] rounded-lg cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>Inspect</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-[#5F5A5C] italic">
                      No records filed in archive yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: AUDIT ACTIVITIES FEED */}
        {activeTab === "audit" && (
          <div className="divide-y divide-[#E8E3E1]">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 px-4 flex items-center justify-between hover:bg-[#F4E7EA]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] shrink-0 font-mono">
                      {act.action}
                    </span>
                    <p className="text-xs text-[#1D1A1B] truncate font-medium">
                      {act.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#5F5A5C] shrink-0">
                    <span className="hidden sm:inline font-medium">{act.user?.name || "System"}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A87818]" />
                      {act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#5F5A5C] italic">
                No recent activity events recorded.
              </div>
            )}
          </div>
        )}

        {/* STREAM FOOTER */}
        <div className="p-3 px-4 bg-[#FCFAF8] border-t border-[#E8E3E1] flex items-center justify-between">
          <span className="text-[11px] text-[#5F5A5C]">
            Showing latest {activeTab === "documents" ? "5 records" : "5 activities"}
          </span>
          <Link
            to={activeTab === "documents" ? "/document-center" : "/logs"}
            className="text-xs font-bold text-[#6B1D2A] hover:underline flex items-center gap-1"
          >
            <span>{activeTab === "documents" ? "Open Document Center" : "View Full Audit Ledger"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
